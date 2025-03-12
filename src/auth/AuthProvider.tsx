import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  loginUser,
  fetchCurrentUser,
  logoutUser,
} from "../api/user/userService";

// Define the shape of the authentication context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  authChecked: boolean; // New flag to track if auth check has completed
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create a new authentication context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    // Try to get from localStorage first for immediate display
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        // Don't set loading to false yet, we're still validating with the server
      } catch (e) {
        // Invalid JSON in localStorage
        localStorage.removeItem('cachedUser');
      }
    }
    
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        // Cache the user for next load
        if (currentUser) {
          localStorage.setItem('cachedUser', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('cachedUser');
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('cachedUser');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser({ email, password });
      const currentUser = await fetchCurrentUser();
      if (!currentUser) throw new Error("User data not returned after login.");
      setUser(currentUser);
      localStorage.setItem('cachedUser', JSON.stringify(currentUser));
    } catch (error) {
      console.error("login error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('cachedUser');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authChecked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};