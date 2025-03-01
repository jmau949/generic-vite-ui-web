import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAuthToken, removeAuthToken } from "../api/auth"; // Adjust paths as needed
import Cookies from "js-cookie";
import MetaTags from "../components/MetaTags";

const HomePage = () => {
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
