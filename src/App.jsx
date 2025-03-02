import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// HelmetProvider allows any component in the app to modify the document head (such as title, meta tags)
// dynamically and asynchronously. This is especially useful for SEO and server-side rendering,
// as it enables different routes or components to specify their own head information.
import { HelmetProvider } from "react-helmet-async";

import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

// Import AuthProvider from our custom authentication module.
// AuthProvider is a context provider that manages authentication state (e.g., whether a user is logged in).
// It likely provides authentication methods (such as login and logout) and holds user data,
// making it accessible to all child components via React's Context API.
import { AuthProvider } from "./auth/AuthProvider"; // Ensure AuthProvider is used

import "./globals.sass";
import "./themes/light.sass";
import "./themes/light-high-contrast.sass";
import "./themes/dark.sass";
import "./themes/dark-high-contrast.sass";

const App = () => {
  return (
    // Wrap the entire application in HelmetProvider to manage changes to the document head.
    <HelmetProvider>
      {/* Wrap the application in AuthProvider so that all nested components can access authentication state and methods.
          This is key for managing secure areas of the app and providing login/logout functionality. */}
      <AuthProvider>
        <Router>
          <RootLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </RootLayout>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
