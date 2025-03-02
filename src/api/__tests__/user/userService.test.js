// auth.test.js
import {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  fetchCurrentUser,
} from "../../user/userService";
import { api } from "../../api";
import { logError } from "../../../utils/errorHandling";
import { validateEmail, validatePassword } from "../../../utils/validations";

// Mock external modules
jest.mock("../../api", () => ({
  api: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock("../../../utils/errorHandling", () => ({
  logError: jest.fn(),
}));

jest.mock("../../../utils/validations", () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

describe("Authentication actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    const validEmail = "test@example.com";
    const validPassword = "password123";

    it("should throw an error when email is invalid", async () => {
      validateEmail.mockReturnValue(false);

      await expect(
        loginUser({ email: "invalid", password: validPassword })
      ).rejects.toThrow("Invalid email format.");
      expect(validateEmail).toHaveBeenCalledWith("invalid");
    });

    it("should throw an error when password is invalid", async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue(false);

      await expect(
        loginUser({ email: validEmail, password: "short" })
      ).rejects.toThrow("Password must be at least 8 characters.");
      expect(validatePassword).toHaveBeenCalledWith("short");
    });

    it("should login user successfully when validations pass", async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue(true);
      const mockResponse = { data: { user: { id: 1, email: validEmail } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await loginUser({
        email: validEmail,
        password: validPassword,
      });

      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/users/login",
        { user: { email: validEmail, password: validPassword } },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should log error and throw an error when API call fails with a response message", async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue(true);
      const errorResponse = {
        response: { data: { message: "User not found" } },
      };
      api.post.mockRejectedValue(errorResponse);

      await expect(
        loginUser({ email: validEmail, password: validPassword })
      ).rejects.toThrow("User not found");
      expect(logError).toHaveBeenCalledWith("Login failed", errorResponse);
    });

    it("should log error and throw default error when API call fails without a response message", async () => {
      validateEmail.mockReturnValue(true);
      validatePassword.mockReturnValue(true);
      const errorResponse = { response: {} };
      api.post.mockRejectedValue(errorResponse);

      await expect(
        loginUser({ email: validEmail, password: validPassword })
      ).rejects.toThrow("Login failed. Please try again later.");
      expect(logError).toHaveBeenCalledWith("Login failed", errorResponse);
    });
  });

  describe("registerUser", () => {
    const userData = { email: "test@example.com", password: "password123" };

    it("should register user successfully", async () => {
      const mockResponse = { data: { user: { id: 1, ...userData } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await registerUser(userData);

      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/users",
        { user: userData },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should log error and throw an error when registration fails with a response message", async () => {
      const errorResponse = {
        response: { data: { message: "Signup failed due to server error" } },
      };
      api.post.mockRejectedValue(errorResponse);

      await expect(registerUser(userData)).rejects.toThrow(
        "Signup failed due to server error"
      );
      expect(logError).toHaveBeenCalledWith("Signup failed", errorResponse);
    });

    it("should throw default error when registration fails without a response message", async () => {
      const errorResponse = { response: {} };
      api.post.mockRejectedValue(errorResponse);

      await expect(registerUser(userData)).rejects.toThrow(
        "Signup failed. Please try again later."
      );
      expect(logError).toHaveBeenCalledWith("Signup failed", errorResponse);
    });
  });

  describe("updateUser", () => {
    const userData = { email: "update@example.com", name: "Test User" };

    it("should update user successfully", async () => {
      const mockResponse = { data: { user: { id: 1, ...userData } } };
      api.put.mockResolvedValue(mockResponse);

      const result = await updateUser(userData);

      expect(api.put).toHaveBeenCalledWith(
        "/api/v1/users",
        { user: userData },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should log error and throw an error when update fails with a response message", async () => {
      const errorResponse = {
        response: { data: { message: "Update failed due to server error" } },
      };
      api.put.mockRejectedValue(errorResponse);

      await expect(updateUser(userData)).rejects.toThrow(
        "Update failed due to server error"
      );
      expect(logError).toHaveBeenCalledWith(
        "Update profile failed",
        errorResponse
      );
    });

    it("should throw default error when update fails without a response message", async () => {
      const errorResponse = { response: {} };
      api.put.mockRejectedValue(errorResponse);

      await expect(updateUser(userData)).rejects.toThrow(
        "Update failed. Please try again later."
      );
      expect(logError).toHaveBeenCalledWith(
        "Update profile failed",
        errorResponse
      );
    });
  });

  describe("logoutUser", () => {
    it("should logout user successfully", async () => {
      api.post.mockResolvedValue({});

      await expect(logoutUser()).resolves.toBeUndefined();
      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
    });

    it("should log error and rethrow error when logout fails", async () => {
      const error = new Error("Logout error");
      api.post.mockRejectedValue(error);

      await expect(logoutUser()).rejects.toThrow("Logout error");
      expect(logError).toHaveBeenCalledWith("Logout failed", error);
    });
  });

  describe("fetchCurrentUser", () => {
    it("should fetch current user successfully", async () => {
      const mockUser = { id: 1, email: "test@example.com" };
      const mockResponse = { data: { user: mockUser } };
      api.get.mockResolvedValue(mockResponse);

      const result = await fetchCurrentUser();

      expect(api.get).toHaveBeenCalledWith("/api/v1/users/me", {
        withCredentials: true,
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw an error when fetching current user fails", async () => {
      const error = new Error("Fetch error");
      api.get.mockRejectedValue(error);

      await expect(fetchCurrentUser()).rejects.toThrow("Fetch error");
    });
  });
});
