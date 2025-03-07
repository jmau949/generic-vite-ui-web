import { api } from "../api";
import { logError } from "../../utils/errorHandling";
import { validateEmail, validatePassword } from "../../utils/validation";

// Define types for user authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  sub?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any; // Allows additional properties from Cognito's response
}

// Login a user with validations and cookie-based authentication
export const loginUser = async ({
  email,
  password,
}: LoginCredentials): Promise<User> => {
  if (!validateEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 8 characters.");
  }
  try {
    const response = await api.post<{ user: User }>(
      "/api/v1/users/login",
      { user: { email, password } },
      { withCredentials: true }
    );
    return response.data.user;
  } catch (error: any) {
    logError("Login failed", error);
    throw new Error(
      error.response?.data?.error || "Login failed. Please try again later."
    );
  }
};

// Register a new user
export const signupUser = async (userData: Partial<User>): Promise<User> => {
  try {
    console.log("userData", userData);
    const response = await api.post<{ user: User }>(
      "/api/v1/users",
      { user: userData },
      { withCredentials: true }
    );
    console.log("response11111", response);
    return response.data.user;
  } catch (error: any) {
    console.log("error22222", error);
    logError("Signup failed", error);
    throw new Error(
      error.response?.data?.error || "Signup failed. Please try again later."
    );
  }
};

// Update a user's profile
export const updateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<{ user: User }>(
      "/api/v1/users",
      { user: userData },
      { withCredentials: true }
    );
    return response.data.user;
  } catch (error: any) {
    logError("Update profile failed", error);
    throw new Error(
      error.response?.data?.error || "Update failed. Please try again later."
    );
  }
};

// Logout a user (removes the auth cookie)
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/api/v1/users/logout", {}, { withCredentials: true });
  } catch (error: any) {
    logError("Logout failed", error);
    throw error;
  }
};

// Fetch the current user session
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<{ user: User }>("/api/v1/users/me", {
      withCredentials: true,
    });
    return data?.user || null;
  } catch (error: any) {
    return null;
  }
};

export const resetPassword = async (userData: Partial<User>): Promise<void> => {
  try {
    await api.post(
      "/api/v1/users/forgot-password",
      { user: userData },
      { withCredentials: true }
    );
  } catch (error: any) {
    logError("forgot password failed", error);
    throw new Error(
      error.response?.data?.error ||
        "Password reset failed. Please try again later."
    );
  }
};

export const confirmForgotPassword = async (
  userData: Partial<User>
): Promise<void> => {
  try {
    await api.post(
      "/api/v1/users/confirm-forgot-password",
      { user: userData },
      { withCredentials: true }
    );
  } catch (error: any) {
    logError("confirm forgot password failed", error);
    throw new Error(
      error.response?.data?.error ||
        "Password reset confirmation failed. Please try again later."
    );
  }
};
