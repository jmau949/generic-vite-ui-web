import { useCallback } from "react";
import { useAuth } from "../auth/AuthProvider"; // Import authentication context hook
import errorLoggingService from "../components/ErrorBoundary/errorLoggingService";

type ErrorContext = Record<string, unknown>;

/**
 * Custom hook for handling errors consistently across the application.
 * It logs errors to an external service (like Sentry) and includes user-specific context.
 *
 * @param {ErrorContext} [defaultContext] - Optional default context data to include in all error logs.
 * @returns {(error: unknown, operation?: string, additionalContext?: ErrorContext) => Error}
 */
export const useErrorHandler = (defaultContext?: ErrorContext) => {
  const { user } = useAuth();
  const userEmail = user?.email || "unknown";

  /**
   * Handles and logs errors by converting them to a standard format
   * and sending them to an error logging service.
   *
   * @param {unknown} error - The error encountered (can be any type).
   * @param {string} [operation] - A label or name for the operation where the error occurred.
   * @param {ErrorContext} [additionalContext] - Additional metadata related to the error.
   * @returns {Error} - Returns the normalized error object.
   */
  const handleError = useCallback(
    (error: unknown, operation?: string, additionalContext?: ErrorContext) => {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      // Merge the default context, additional context, and operation metadata
      const context = {
        ...defaultContext,
        ...additionalContext,
        operation,
      };

      // Log the error to the external service, including the user's email for tracking
      errorLoggingService.logError(errorObj, null, context, userEmail);

      // Return the error so it can be re-thrown or handled elsewhere if needed
      return errorObj;
    },
    [defaultContext, userEmail] // Dependencies ensure function updates if default context or user email changes
  );

  return handleError;
};
