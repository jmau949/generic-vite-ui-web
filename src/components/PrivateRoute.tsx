import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Spinner } from "./ui/spinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { status, user, isLoading } = useAuth();
  const location = useLocation();

  // Check if still determining auth status
  if (status === "idle" || status === "checking" || isLoading) {
    return <Spinner />;
  }

  // User is not authenticated
  if (status === "unauthenticated" || !user) {
    // Redirect to login but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default PrivateRoute;
