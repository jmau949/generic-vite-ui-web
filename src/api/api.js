// api.js
import axios from "axios";
import { logError, notifyAdmin } from "../utils/errorHandling";
import { refreshAuthToken } from "./auth";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: import.meta.env.VITE_REQUEST_TIMEOUT || 10000,
  withCredentials: true, // Send session cookies with requests
});

// Exponential backoff delay function
const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

// Request interceptor for authorization
api.interceptors.request.use(
  (config) => {
    // Optionally, add any additional headers here, such as Authorization tokens

    return config;
  },
  (error) => {
    logError(error); // Centralized error logging
    notifyAdmin("Request failed: ", error); // Notify admin if request fails
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and retries
api.interceptors.response.use(
  (response) => response, // Return response directly if successful
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors and refresh session
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAuthToken(); // Attempt to refresh the session
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        logError(refreshError); // Log any error during session refresh
        return Promise.reject(refreshError);
      }
    }

    // Exponential backoff for throttling or retry logic (status 429 or 5xx)
    if (
      error.response?.status === 429 ||
      (error.response?.status >= 500 && error.config.retry)
    ) {
      originalRequest._retry = true;
      const retryCount = error.config.__retryCount || 0;
      if (retryCount < process.env.VITE_MAX_RETRIES || 3) {
        // Max retries configurable
        error.config.__retryCount = retryCount + 1;
        const backoffDuration = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await delay(backoffDuration);
        return api(originalRequest); // Retry the original request
      }
    }

    // Handle timeout errors specifically
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      logError("Request timed out:", error);
      return Promise.reject(
        new Error(
          "The request took too long to complete. Please try again later."
        )
      );
    }

    logError(error); // Log other types of errors
    notifyAdmin("Critical API failure", error); // Notify admin of critical failure
    return Promise.reject(error); // Reject the error to be handled by caller
  }
);

export { api };
