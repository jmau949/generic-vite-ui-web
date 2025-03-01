// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider"; // Ensure AuthProvider is used

import "./globals.sass";
import "./themes/light.sass";
import "./themes/light-high-contrast.sass";
import "./themes/dark.sass";
import "./themes/dark-high-contrast.sass";

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <RootLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* Protected Route */}
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
