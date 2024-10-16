import { api, logError } from "./api";

// API call to log in a user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login", {
      user: { email, password },
    });
    return response.data;
  } catch (error) {
    logError("Login failed", error);
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
