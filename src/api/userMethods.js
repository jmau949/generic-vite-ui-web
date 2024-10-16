import { api } from "./api";
import { logError, notifyAdmin } from "../utils/errorHandling";
import { validateEmail, validatePassword } from "../utils/validations";
import { saveAuthToken } from "./auth";

// API call to log in a user
export const loginUser = async ({ email, password }) => {
  if (!validateEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 8 characters.");
  }
  try {
    const response = await api.post("/api/v1/users/login", {
      user: { email, password },
    });
    // Save the token to session storage
    console.log("response", response);
    const token = response.data.token;
    if (token) {
      saveAuthToken(token);
    } else {
      throw new Error("No token received from server.");
    }
    console.log("response", response);
    return response.data;
  } catch (error) {
    logError("Login failed!!!", error);
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again later."
    );
  }
};

// API call to register a user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users", { user: userData });
    return response.data;
  } catch (error) {
    logError("Signup failed", error);
    throw new Error(
      error.response?.data?.message || "Signup failed. Please try again later."
    );
  }
};

// API call to update a user's profile
export const updateUser = async (userData) => {
  try {
    const response = await api.put("/users", { user: userData });
    return response.data;
  } catch (error) {
    logError("Update profile failed", error);
    throw new Error(
      error.response?.data?.message || "Update failed. Please try again later."
    );
  }
};
