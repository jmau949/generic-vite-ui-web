import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface PrivateRouteProps {
  children: ReactNode;
}

// temp
const AnimatedLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        {/* Animated circles */}
        <div className="flex space-x-2 mb-4">
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "450ms" }}
          ></div>
        </div>

        {/* Loading text with fade-in animation */}
        <div className="text-gray-700 font-medium animate-pulse">
          Loading your account...
        </div>
      </div>
    </div>
  );
};
// PrivateRoute is a wrapper component that controls access to its children based on authentication status.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // - user: contains the authenticated user's data if logged in, or null otherwise.
  // - loading: indicates if an authentication-related API call is currently in progress.
  // - authChecked: a flag that tells us whether the initial authentication check has been completed.
  const { user, loading, authChecked } = useAuth();

  // If the app is currently fetching auth information (loading is true) and
  // the initial auteted yet (authChecked is false),
  // render a loading spinner to hentication check hasn't complinform the user that the process is ongoing.
  if (loading && !authChecked) return <AnimatedLoader />;

  // After the authentication check is complete (authChecked is true),
  // if no user is found (user is null), redirect the user to the login page.
  // The 'replace' prop ensures that the redirect replaces the current entry in the history stack,
  // so the user cannot navigate back to the protected route.
  if (authChecked && !user) return <Navigate to="/login" replace />;

  // If a user is authenticated or we are using a cached user while final auth check completes,
  // render the children components to allow access to the protected route.
  return <>{children}</>;
};

// Export the PrivateRoute component as the default export so it can be used in other parts of the application.
export default PrivateRoute;
