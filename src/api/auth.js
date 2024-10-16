import { api } from "./api";
import { logError, notifyAdmin } from "../utils/errorHandling";

// Save token securely in session storage
export const saveAuthToken = (token) => {
  try {
    if (window.sessionStorage) {
      sessionStorage.setItem("authToken", token);
    } else {
      throw new Error("Session storage is not available.");
    }
  } catch (error) {
    logError("Failed to save auth token in session storage", error);
    notifyAdmin("Critical issue: Unable to store auth token.");
  }
};

// Retrieve token from session storage
export const getAuthToken = () => {
  try {
    return sessionStorage.getItem("authToken");
  } catch (error) {
    logError("Failed to retrieve auth token from session storage", error);
    return null;
  }
};

// Remove the token from session storage (e.g., on logout)
export const removeAuthToken = () => {
  try {
    sessionStorage.removeItem("authToken");
  } catch (error) {
    logError("Failed to remove auth token from session storage", error);
  }
};

// Set Authorization header in Axios with the token from session storage
export const setAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    logError("No token found in session storage");
  }
};

// Proactively refresh the authentication token and store the new token in session storage
export const refreshAuthToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");

    if (response.data && response.data.token) {
      const newToken = response.data.token;
      saveAuthToken(newToken); // Save the new token in session storage
      setAuthHeader(); // Update Axios headers with the new token
    } else {
      throw new Error("Invalid token received during refresh.");
    }
  } catch (error) {
    logError("Token refresh failed", error);
    removeAuthToken(); // Invalidate session if refresh fails
    notifyAdmin("Token refresh failed: User must re-login");
    throw new Error("Session expired. Please log in again.");
  }
};

// Helper function to check token existence
export const isAuthenticated = () => {
  return !!getAuthToken(); // Return true if token exists
};

// Helper function to clear session data on logout
export const logout = () => {
  try {
    removeAuthToken();
    // Optionally, make an API call to invalidate the session on the backend
    // api.post("/auth/logout"); // Adjust based on backend logic
  } catch (error) {
    logError("Logout failed", error);
  }
};
