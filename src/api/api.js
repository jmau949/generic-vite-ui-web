import axios from "axios";
import { logError, notifyAdmin } from "../utils/errorHandling";
import { logoutUser } from "./user/userService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Set default headers for every request; here, we ensure that the content is sent in JSON format
  headers: {
    "Content-Type": "application/json",
  },
  timeout: import.meta.env.VITE_REQUEST_TIMEOUT || 10000,
  // Enable sending cookies and other credentials with requests to support sessions
  withCredentials: true,
});

// Define an asynchronous delay function that returns a promise, used for implementing exponential backoff
const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

// Add a response interceptor to the Axios instance to handle errors and implement retry logic
api.interceptors.response.use(
  // Success handler: if the response is successful, simply return it without modifications
  (response) => response,
  // Error handler: this asynchronous function processes any errors encountered during the request
  async (error) => {
    // Save the configuration of the original request; this is useful for potentially retrying the request
    const originalRequest = error.config;

    // Check if the error status code is 401 (Unauthorized)
    // This typically indicates that the user's session has expired or they are not properly authenticated
    if (error.response?.status === 401) {
      // Log the error with a custom message about session expiration or unauthorized access
      logError("Session expired or unauthorized access", error);
      // Call the logoutUser function to clear the user session
      await logoutUser();
      // Reject the promise with a new error message prompting the user to log in again
      return Promise.reject(
        new Error("Your session has expired. Please log in again.")
      );
    }

    // Check for HTTP status 429 (Too Many Requests) or any 5xx server errors,
    // and ensure the request is eligible for a retry (i.e., it hasn't been flagged to skip retries)
    if (
      error.response?.status === 429 ||
      (error.response?.status >= 500 && originalRequest?.retry !== false)
    ) {
      // Initialize or retrieve the retry counter for this request; default to 0 if not already set
      originalRequest._retry = originalRequest._retry || 0;
      // Check if the current retry count is less than the maximum allowed retries (from an environment variable or default to 3)
      if (originalRequest._retry < (import.meta.env.VITE_MAX_RETRIES || 3)) {
        // Increment the retry counter for this request
        originalRequest._retry += 1;
        // Calculate the delay using exponential backoff: 2 raised to the power of the retry count multiplied by 1000 (to convert to milliseconds)
        const backoffDuration = Math.pow(2, originalRequest._retry) * 1000;
        // Wait for the calculated backoff duration before retrying the request
        await delay(backoffDuration);
        // Retry the original request using the same Axios instance and return its promise
        return api(originalRequest);
      }
    }

    // Handle timeout errors: check if the error code indicates a connection abort (ECONNABORTED)
    // or if the error message mentions "timeout"
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      // Log the timeout error with a custom message
      logError("Request timed out:", error);
      // Reject the promise with a new error message to inform the caller of the timeout
      return Promise.reject(
        new Error(
          "The request took too long to complete. Please try again later."
        )
      );
    }

    // For all other error types:
    // Log the error using the logError function
    logError(error);
    // Notify the administrator of a critical API failure using the notifyAdmin function
    notifyAdmin("Critical API failure", error);
    // Reject the promise with the original error, so the caller can handle it appropriately
    return Promise.reject(error);
  }
);

// Export the configured Axios instance (api) for use in other parts of the application
export { api };
