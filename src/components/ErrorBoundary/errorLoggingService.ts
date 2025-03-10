// Import the ErrorInfo type from React which provides details about the error in the component tree.
import { ErrorInfo } from "react";
import * as Sentry from "@sentry/react";

/**
 * Interface defining the shape of the error log data.
 * This includes:
 * - error: The actual Error object.
 * - errorInfo: Optional React error information (such as the component stack).
 * - context: Optional additional context as a record of key-value pairs.
 * - userId: Optional identifier for the user (could be fetched from an auth service).
 * - timestamp: The time at which the error was logged.
 */
interface ErrorLogData {
  error: Error;
  errorInfo?: ErrorInfo | null;
  context?: Record<string, unknown>;
  userId?: string;
  timestamp: string;
}

/**
 * ErrorLoggingService is designed as a singleton class to ensure only one instance exists.
 * This service is responsible for logging errors and sending error details to an external service.
 */
class ErrorLoggingService {
  // A static property to hold the singleton instance.
  private static instance: ErrorLoggingService;

  /**
   * The API endpoint for logging errors is configured via an environment variable.
   * If the environment variable is not defined, it falls back to an empty string.
   */
  private apiEndpoint: string =
    import.meta.env.REACT_APP_ERROR_LOGGING_API || "";

  /**
   * The constructor is private to prevent direct instantiation.
   * Initialization logic for error logging services (like Sentry or LogRocket) can be placed here.
   */
  private constructor() {
    // Additional initialization if needed
  }

  /**
   * Public static method to get the singleton instance of the ErrorLoggingService.
   * If an instance doesn't exist yet, it creates one.
   *
   * @returns {ErrorLoggingService} The singleton instance.
   */
  public static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  /**
   * Public method to log an error.
   * It prints error information to the console and, if in production,
   * sends the error details to an external logging service.
   *
   * @param {Error} error - The error object that was caught.
   * @param {ErrorInfo} [errorInfo] - Optional React error information (e.g., component stack).
   * @param {Record<string, unknown>} [context] - Optional additional context to include in the log.
   */
  public logError(
    error: Error,
    errorInfo?: ErrorInfo | null,
    context?: Record<string, unknown>,
    userId?: string // Accept userId parameter (email)
  ): void {
    // Log the error to the console.
    console.error("Error caught by error logging service:", error);

    // If errorInfo is provided, log the component stack.
    if (errorInfo) {
      console.error("Component stack:", errorInfo.componentStack);
    }

    // sentry will not be initialized in development, but logging service might be
    if (import.meta.env.MODE === "development") {
      console.log("not sending to sentry/logging service");
      return;
    }

    const logData: ErrorLogData = {
      error,
      errorInfo,
      context,
      userId,
      timestamp: new Date().toISOString(),
    };
    // send react-error-boundary caught error to sentry

    console.log("sending to sentry, log service", logData);
    this.sendToSentry(logData);

    // In production, send the error log to the external logging service. (splunk, datadog)
    this.sendToLoggingService(logData);
  }
  private sendToSentry(logData: ErrorLogData): void {
    Sentry.captureException(logData.error, {
      extra: {
        componentStack: logData.errorInfo?.componentStack,
        ...logData.context,
        userId: logData.userId, // Send userId to Sentry
      },
    });
  }
  /**
   * Private method to send the error log data to an external logging service.
   * This method abstracts the implementation of sending the log data.
   *
   * @param {ErrorLogData} logData - The error log data to send.
   */
  private sendToLoggingService(logData: ErrorLogData): void {
    // If an API endpoint is provided, send the error details to that endpoint.
    if (this.apiEndpoint) {
      fetch(this.apiEndpoint, {
        method: "POST", // Use HTTP POST to send the error log.
        headers: {
          "Content-Type": "application/json", // Specify that the request body is JSON.
        },
        body: JSON.stringify(logData),
      }).catch((err) => {
        // If sending the error log fails, handle the error.
        // In production, fail silently; in development, log the failure.
        if (import.meta.env.MODE === "development") {
          console.error("development err:", err);
        }
      });
    }

    // Alternatively, if you are using a third-party logging service such as Sentry,
    // you could capture the exception with additional context as shown in the commented code below:
    // Sentry.captureException(logData.error, {
    //   extra: {
    //     componentStack: logData.errorInfo?.componentStack,
    //     ...logData.context
    //   }
    // });
  }
}

// Export the singleton instance of the ErrorLoggingService.
// This ensures that all parts of the application use the same instance.
export default ErrorLoggingService.getInstance();
