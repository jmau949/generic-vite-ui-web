import { api } from "./api";
import { logError, notifyAdmin } from "../utils/errorHandling";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // To decode and check JWT expiration

// Retrieve token from cookies
export const getAuthToken = () => {
  try {
    console.log("Cookies", Cookies);
    console.log("Cookies.get(authToken)", Cookies.get("authToken"));
    return Cookies.get("authToken"); // Automatically handles decoding
  } catch (error) {
    logError("Failed to retrieve auth token from cookies", error);
    return null;
  }
};
// Remove the token from cookies (e.g., on logout)
export const removeAuthToken = () => {
  try {
    Cookies.remove("authToken", {
      path: "/",
      secure: true,
      sameSite: "Strict",
    }); // Properly removes cookie
  } catch (error) {
    logError("Failed to remove auth token from cookies", error);
  }
};

// Set Authorization header in Axios with the token from cookies
export const setAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    logError("No token found in cookies");
  }
};
// Proactively refresh the authentication token and store the new token in cookies
// Decode and check if the token is expired
export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token has expired
    return decodedToken.exp < currentTime;
  } catch (error) {
    logError("Failed to decode token", error);
    return true; // Assume expired if decoding fails
  }
};

// Proactively refresh the authentication token and store the new token in cookies
export const refreshAuthToken = async () => {
  try {
    const response = await api.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );

    if (response.data && response.data.token) {
      const newToken = response.data.token;

      // In production, cookies should be set server-side with HttpOnly
      Cookies.set("authToken", newToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
        expires: 7, // 7-day expiration
      });

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

export const isAuthenticated = () => {
  const token = getAuthToken();
  console.log("token", token);
  return token && !isTokenExpired(token); // Return true if token exists and is not expired
};

// Helper function to clear session data on logout
export const logout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true }); // Ensure backend invalidates token
    removeAuthToken(); // Clear client-side cookies
  } catch (error) {
    logError("Logout failed", error);
  }
};
