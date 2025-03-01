// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("user", user);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
