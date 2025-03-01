import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  fetchCurrentUser,
  logoutUser,
} from "../api/user/userService";

// Create a new authentication context.
// A context provides a way to share values (like authentication data)
// between components without explicitly passing props through every level.
const AuthContext = createContext();

/**
 * AuthProvider component
 *
 * This component wraps parts of your app and supplies them with authentication data
 * and functions via the AuthContext.Provider. It maintains the state related to authentication,
 * such as the current user and whether the app is still loading the user's session.
 *
 * How it works:
 * 1. It defines state variables: `user` to hold the authenticated user data and `loading` to indicate
 *    whether authentication data is being fetched.
 * 2. On component mount, it attempts to load the current user session using the `fetchCurrentUser` service.
 *    This is done inside a useEffect hook.
 * 3. It defines two functions: `login` and `logout` for handling user login and logout actions.
 * 4. It returns an AuthContext.Provider that makes the state and functions available to any nested
 *    component that uses the `useAuth` hook.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      await loginUser({ email, password });
      const currentUser = await fetchCurrentUser();
      if (!currentUser) throw new Error("User data not returned after login.");
      setUser(currentUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * AuthContext.Provider
   *
   * The provider component makes the authentication state and functions available
   * to any descendant components that consume this context via the `useAuth` hook.
   *
   * The `value` prop of the provider includes:
   * - `user`: The current authenticated user (or null if not authenticated).
   * - `loading`: A boolean indicating if the user session is still being loaded.
   * - `login`: Function to log in a user.
   * - `logout`: Function to log out the user.
   *
   * This avoids the need to pass these values down through props manually (known as "prop drilling").
   */
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth custom hook
 *
 * This hook provides an easy way for components to access the authentication context.
 * Instead of importing both `useContext` and `AuthContext` in every component, you can simply
 * import and call `useAuth()` to get the authentication state and functions.
 *
 * Under the hood, it uses React's useContext hook to access the nearest AuthContext.Provider.
 */
export const useAuth = () => useContext(AuthContext);
