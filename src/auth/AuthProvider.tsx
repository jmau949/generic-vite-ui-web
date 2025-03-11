import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  fetchCurrentUser,
  logoutUser,
  refreshToken,
} from "../api/user/userService";
import { setUser, clearUser } from "../redux/user/userSlice";
import { User } from "@/types/user";
// Define auth states
type AuthStatus =
  | "idle" // Initial state
  | "checking" // Checking authentication
  | "authenticated" // User is authenticated
  | "unauthenticated"; // User is not authenticated

// Define error types
type AuthError =
  | null
  | "invalid_credentials"
  | "expired_token"
  | "network_error"
  | "unknown_error";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  error: AuthError;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// With a 12-hour token, we can refresh when it's 90% through its lifetime
// 12 hours * 90% = 10.8 hours = 10h48m = 648 minutes
const TOKEN_REFRESH_THRESHOLD = 4 * 60 * 1000; // milliseconds

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const [authState, setAuthState] = useState<AuthState>({
    status: "idle",
    user: null,
    error: null,
    isLoading: true,
  });

  // Store token issue time to calculate when refresh is needed
  const [tokenIssueTime, setTokenIssueTime] = useState<number | null>(
    // Try to retrieve from localStorage on mount
    Number(localStorage.getItem("tokenIssueTime")) || null
  );

  // Clear any auth errors
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  // Refresh the auth token and update issue time
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await refreshToken(); // Call to your API that refreshes the token

      // Update token issue time
      const now = Date.now();
      setTokenIssueTime(now);
      localStorage.setItem("tokenIssueTime", now.toString());
      console.log("Token refreshed successfully at:", new Date().toISOString());

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Check if token needs refresh based on issue time
  const shouldRefreshToken = useCallback(() => {
    if (!tokenIssueTime) return false;

    const now = Date.now();
    const timeSinceIssue = now - tokenIssueTime;

    const shouldRefresh = timeSinceIssue > TOKEN_REFRESH_THRESHOLD;
    if (shouldRefresh) {
      console.log(
        "Token needs refresh. Age:",
        Math.round(timeSinceIssue / 1000),
        "seconds"
      );
    }

    return shouldRefresh;
  }, [tokenIssueTime]);

  // Initialize auth state
  useEffect(() => {
    const checkAuthStatus = async () => {
      setAuthState((prev) => ({
        ...prev,
        status: "checking",
        isLoading: true,
      }));

      try {
        // If we already have a user in Redux state, use that
        if (currentUser) {
          // Check if we need to refresh the token
          if (shouldRefreshToken()) {
            await refreshSession();
          }

          setAuthState({
            status: "authenticated",
            user: currentUser,
            error: null,
            isLoading: false,
          });
          return;
        }

        // Otherwise, fetch the current user from API
        const user = await fetchCurrentUser();

        if (user) {
          dispatch(setUser(user));

          // Set token issue time if it wasn't set before
          if (!tokenIssueTime) {
            const now = Date.now();
            setTokenIssueTime(now);
            localStorage.setItem("tokenIssueTime", now.toString());
          }

          setAuthState({
            status: "authenticated",
            user,
            error: null,
            isLoading: false,
          });
        } else {
          dispatch(clearUser());
          setAuthState({
            status: "unauthenticated",
            user: null,
            error: null,
            isLoading: false,
          });
        }
      } catch (error: any) {
        // Handle different types of errors
        let errorType: AuthError = "unknown_error";

        if (error.message?.includes("expired")) {
          errorType = "expired_token";
        } else if (error.message?.includes("network")) {
          errorType = "network_error";
        }

        // Clear the user if there's an error
        dispatch(clearUser());
        localStorage.removeItem("tokenIssueTime");
        setTokenIssueTime(null);

        setAuthState({
          status: "unauthenticated",
          user: null,
          error: errorType,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, [
    dispatch,
    currentUser,
    refreshSession,
    shouldRefreshToken,
    tokenIssueTime,
  ]);

  // Set up periodic token refresh check - much less frequent with 12hr tokens
  useEffect(() => {
    if (authState.status !== "authenticated") return;

    // Check every hour if token needs refresh
    const tokenCheckInterval = setInterval(() => {
      if (shouldRefreshToken()) {
        refreshSession();
      }
    }, 30 * 1000); // Check once per hour

    return () => clearInterval(tokenCheckInterval);
  }, [authState.status, refreshSession, shouldRefreshToken]);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      await loginUser({ email, password });
      const user = await fetchCurrentUser();

      if (!user) throw new Error("User data not returned after login.");

      // Update token issue time on successful login
      const now = Date.now();
      setTokenIssueTime(now);
      localStorage.setItem("tokenIssueTime", now.toString());

      dispatch(setUser(user));
      setAuthState({
        status: "authenticated",
        user,
        error: null,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      let errorType: AuthError = "unknown_error";
      if (error.message?.includes("credentials")) {
        errorType = "invalid_credentials";
      } else if (error.message?.includes("network")) {
        errorType = "network_error";
      }

      setAuthState((prev) => ({
        ...prev,
        error: errorType,
        isLoading: false,
      }));

      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      await logoutUser();
      dispatch(clearUser());

      // Clear token issue time
      localStorage.removeItem("tokenIssueTime");
      setTokenIssueTime(null);

      setAuthState({
        status: "unauthenticated",
        user: null,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if logout fails on the server, we clear local state
      dispatch(clearUser());
      localStorage.removeItem("tokenIssueTime");
      setTokenIssueTime(null);

      setAuthState({
        status: "unauthenticated",
        user: null,
        error: "unknown_error",
        isLoading: false,
      });
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshSession,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
