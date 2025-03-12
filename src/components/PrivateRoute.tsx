import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Spinner } from "./ui/spinner";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, authChecked } = useAuth();

  // Show loading spinner only while authentication is being checked
  if (loading && !authChecked) return <Spinner />;

  // Once auth is checked, redirect to login if no user
  if (authChecked && !user) return <Navigate to="/login" replace />;

  // If we have a user or still checking auth with cached user
  return <>{children}</>;
};

export default PrivateRoute;