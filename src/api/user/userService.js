import { api } from "../api";
import { logError } from "../../utils/errorHandling";
import { validateEmail, validatePassword } from "../../utils/validations";

// Login a user with validations and cookie-based authentication
export const loginUser = async ({ email, password }) => {
  if (!validateEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 8 characters.");
  }
  try {
    const response = await api.post(
      "/api/v1/users/login",
      { user: { email, password } },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Login failed", error);
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again later."
    );
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post(
      "/api/v1/users",
      { user: userData },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Signup failed", error);
    throw new Error(
      error.response?.data?.message || "Signup failed. Please try again later."
    );
  }
};

// Update a user's profile
export const updateUser = async (userData) => {
  try {
    const response = await api.put(
      "/api/v1/users",
      { user: userData },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    logError("Update profile failed", error);
    throw new Error(
      error.response?.data?.message || "Update failed. Please try again later."
    );
  }
};

// Logout a user (removes the auth cookie)
export const logoutUser = async () => {
  try {
    await api.post("/api/v1/users/logout", {}, { withCredentials: true });
  } catch (error) {
    logError("Logout failed", error);
    throw error;
  }
};

// Fetch the current user session
export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get("/api/v1/users/me", {
      withCredentials: true,
    });
    return data?.user;
  } catch (error) {
    throw error;
  }
};
