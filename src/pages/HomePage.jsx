import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAuthToken, removeAuthToken } from "../api/auth"; // Adjust paths as needed
import MetaTags from "../components/MetaTags";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
    } else {
      try {
        // Decode the JWT token to check for expiry
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decodedToken.exp < currentTime) {
          // Token expired, remove and redirect
          removeAuthToken();
          navigate("/login");
        } else {
          setIsLoading(false); // Token is valid, proceed to render page
        }
      } catch (error) {
        // Handle any issues with decoding or invalid token
        console.error("Token validation failed", error);
        removeAuthToken(); // Invalidate token on error
        navigate("/login");
      }
    }
  }, [navigate]);

  if (isLoading) {
    // Show a loader while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MetaTags
        title="Lenscribe - Real-time Transcription and AI Summaries"
        description="Lenscribe lets you record, stream, and transcribe meetings, classes, or conversations using Meta glasses. Get AI-generated summaries instantly."
        keywords="Meta glasses, transcription, real-time streaming, AI summaries, meetings, Lenscribe"
        author="Lenscribe Team"
        ogImageUrl="https://www.lenscribe.com/og-image.png"
        ogUrl="https://www.lenscribe.com"
        twitterImageUrl="https://www.lenscribe.com/twitter-image.png"
      />
      <h1>Welcome to Lenscribe</h1>
      <p>
        Transcribe and summarize your conversations with ease using Meta
        glasses.
      </p>
    </div>
  );
};

export default HomePage;
