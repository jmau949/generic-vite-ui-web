export const logError = (error, customMessage = "") => {
  console.error(customMessage, error);
  // Add custom error logging for production, such as sending logs to a logging service (e.g., Sentry, Datadog)
};

// Simulated function to notify admins or external monitoring systems (e.g., Sentry, Slack, etc.)
export const notifyAdmin = (message, error) => {
  console.log("Notify admin: ", message, error);
  // Implement your notification logic here (e.g., sending alerts to monitoring tools like CloudWatch)
};
