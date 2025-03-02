// api.test.js
// Set up global import.meta.env for tests
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: "http://localhost",
        VITE_REQUEST_TIMEOUT: 10000,
        VITE_MAX_RETRIES: 3,
      },
    },
  },
});

import { api } from "../api";
import { logError, notifyAdmin } from "../../utils/errorHandling";
import { logoutUser } from "../user/userService";

// Mock external modules
jest.mock("../../utils/errorHandling", () => ({
  logError: jest.fn(),
  notifyAdmin: jest.fn(),
}));

jest.mock("../user/userService", () => ({
  logoutUser: jest.fn(() => Promise.resolve()),
}));

// Extract the interceptor handlers from the Axios instance
const interceptor = api.interceptors.response.handlers[0];
const successHandler = interceptor.fulfilled;
const errorHandler = interceptor.rejected;

describe("Axios instance interceptors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return response for successful responses", () => {
    const response = { data: "success" };
    expect(successHandler(response)).toEqual(response);
  });

  test("should handle 401 errors by logging out and rejecting with a session expired message", async () => {
    const error = {
      config: {},
      response: { status: 401 },
    };

    await expect(errorHandler(error)).rejects.toThrow(
      "Your session has expired. Please log in again."
    );
    expect(logError).toHaveBeenCalledWith(
      "Session expired or unauthorized access",
      error
    );
    expect(logoutUser).toHaveBeenCalled();
  });

  test("should retry on 429 errors and resolve with the retried response", async () => {
    jest.useFakeTimers();
    const retryResponse = { data: "retrySuccess" };

    // Override the adapter so that when api(originalRequest) is called,
    // it returns a resolved promise with our retryResponse instead of making a real HTTP call.
    api.defaults.adapter = jest.fn(() => Promise.resolve(retryResponse));

    // Provide a valid URL so Axios can process the request.
    const error = {
      config: { url: "/retry-endpoint" },
      response: { status: 429 },
    };

    // Call the error handler (which returns a promise)
    const promise = errorHandler(error);

    // Advance the timers by 2000ms (2^1 * 1000) for the first retry
    jest.advanceTimersByTime(2000);

    const result = await promise;
    expect(result).toEqual(retryResponse);
    expect(error.config._retry).toBe(1);

    jest.useRealTimers();
  });

  test("should not retry if maximum retries have been reached and fall through to general error handling", async () => {
    const error = {
      config: { _retry: 3 }, // assume maximum retries is 3 (VITE_MAX_RETRIES)
      response: { status: 500 },
    };

    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(logError).toHaveBeenCalledWith(error);
    expect(notifyAdmin).toHaveBeenCalledWith("Critical API failure", error);
  });

  test("should handle timeout errors by rejecting with a timeout message", async () => {
    const error = {
      code: "ECONNABORTED",
      message: "Request timeout error",
    };

    await expect(errorHandler(error)).rejects.toThrow(
      "The request took too long to complete. Please try again later."
    );
    expect(logError).toHaveBeenCalledWith("Request timed out:", error);
  });

  test("should handle general errors by logging and notifying admin", async () => {
    const error = new Error("General error");

    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(logError).toHaveBeenCalledWith(error);
    expect(notifyAdmin).toHaveBeenCalledWith("Critical API failure", error);
  });
});
