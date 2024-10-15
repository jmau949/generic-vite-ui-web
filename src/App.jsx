// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
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
            {
              // <Route path="/" element={<Home />} />
              // <Route path="/login" element={<Login />} />
            }
            <Route path="/" element={<Login />} />
          </Routes>
        </RootLayout>
      </Router>
    </HelmetProvider>
  );
};

export default App;
