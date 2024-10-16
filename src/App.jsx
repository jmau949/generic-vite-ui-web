// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./globals.sass";
import "./themes/light.sass";
import "./themes/light-high-contrast.sass";
import "./themes/dark.sass";
import "./themes/dark-high-contrast.sass";

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <RootLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </RootLayout>
      </Router>
    </HelmetProvider>
  );
};

export default App;
