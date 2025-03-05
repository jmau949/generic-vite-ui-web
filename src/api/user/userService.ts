import { api } from "../api";
import { logError } from "../../utils/errorHandling";
import { validateEmail, validatePassword } from "../../utils/validation";

// Define types for user authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
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
      error.response?.data?.message || "Login failed. Please try again later."
    );
  }
};

// Register a new user
export const registerUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post<{ user: User }>(
      "/api/v1/users",
      { user: userData },
      { withCredentials: true }
    );
    return response.data.user;
  } catch (error: any) {
    logError("Signup failed", error);
    throw new Error(
      error.response?.data?.message || "Signup failed. Please try again later."
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
      error.response?.data?.message || "Update failed. Please try again later."
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
