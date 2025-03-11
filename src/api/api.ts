import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { logError, notifyAdmin } from "../utils/errorHandling";
import { logoutUser } from "./user/userService";
import { refreshToken } from "./user/userService"; // Import refreshToken function

// Flag to track if a token refresh is currently in progress
let isRefreshingToken = false;
// Queue to store requests that are waiting for the token refresh
let refreshSubscribers: Array<() => void> = [];

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  timeout:
    (import.meta.env.VITE_REQUEST_TIMEOUT as number | undefined) || 10000,
  withCredentials: true, // Important for cookies to be sent with requests
});

// Function to add callbacks to the subscriber queue
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify all subscribers that the token has been refreshed
const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Function to handle refresh token failure
const onTokenRefreshFailed = () => {
  refreshSubscribers = [];
};

const delay = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
  retry?: boolean;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Check if the error is due to an unauthorized request (401)
    if (error.response?.status === 401 && originalRequest) {
      // Ensure the URL is not the refresh token endpoint itself to prevent loops
      const isRefreshTokenRequest =
        originalRequest.url?.includes("refresh-token");

      if (isRefreshTokenRequest) {
        // If the refresh token endpoint itself returns 401, we can't recover
        logError("Refresh token endpoint returned 401", error.toString());
        await logoutUser();
        return Promise.reject(
          new Error("Authentication failed. Please log in again.")
        );
      }

      if (!isRefreshingToken) {
        isRefreshingToken = true;

        try {
          // Attempt to refresh the token - this will set the new token in cookies
          await refreshToken();

          // If we get here, token refresh was successful
          isRefreshingToken = false;

          // Notify all subscribers that the token has been refreshed
          onTokenRefreshed();

          // Retry the original request - the cookie will be sent automatically
          return api(originalRequest);
        } catch (refreshError) {
          // Token refresh failed
          isRefreshingToken = false;
          onTokenRefreshFailed();
          logError("Token refresh failed", refreshError as string);
          await logoutUser();
          return Promise.reject(
            new Error("Your session has expired. Please log in again.")
          );
        }
      } else {
        // Token refresh is already in progress, so we'll wait for it to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            // Retry the original request - the cookie will be sent automatically
            resolve(api(originalRequest));
          });
        });
      }
    }

    // Remaining error handling logic for other error codes (429, 5xx, etc.)
    if (
      error.response?.status === 429 ||
      ((error.response?.status ?? 0) >= 500 && originalRequest?.retry !== false)
    ) {
      originalRequest._retry = originalRequest._retry || 0;
      if (
        originalRequest._retry <
        ((import.meta.env.VITE_MAX_RETRIES as number) || 3)
      ) {
        originalRequest._retry += 1;
        const backoffDuration = Math.pow(2, originalRequest._retry) * 1000;
        await delay(backoffDuration);
        return api(originalRequest);
      }
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      logError("Request timed out:", error.toString());
      return Promise.reject(
        new Error(
          "The request took too long to complete. Please try again later."
        )
      );
    }

    logError(error);
    notifyAdmin("Critical API failure", error);
    return Promise.reject(error);
  }
);

export { api };