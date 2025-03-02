import React, { useEffect, useState } from "react";


import MetaTags from "../components/MetaTags";

const HomePage = () => {
  return (
    <div>
      <MetaTags
        title="REPLACEME - Real-time Transcription and AI Summaries"
        description="REPLACEME lets you record, stream, and transcribe meetings, classes, or conversations using Meta glasses. Get AI-generated summaries instantly."
        keywords="Meta glasses, transcription, real-time streaming, AI summaries, meetings, REPLACEME"
        author="REPLACEME Team"
        ogImageUrl="https://www.REPLACEME.com/og-image.png"
        ogUrl="https://www.REPLACEME.com"
        twitterImageUrl="https://www.REPLACEME.com/twitter-image.png"
      />
      <h1>Welcome to REPLACEME</h1>
      <p>
        Transcribe and summarize your conversations with ease using Meta
        glasses.
      </p>
    </div>
  );
};

export default HomePage;
