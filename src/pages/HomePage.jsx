import { Helmet } from "react-helmet-async";

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>
          REPLACEME APP NAME - Real-time Transcription and AI Summaries
        </title>
        <meta
          name="description"
          content="REPLACEME APP NAME lets you record, stream, and transcribe meetings, classes, or conversations using Meta glasses. Get AI-generated summaries instantly."
        />
        <meta
          name="keywords"
          content="Meta glasses, transcription, real-time streaming, AI summaries, meetings, REPLACEME APP NAME"
        />
        <meta name="author" content="REPLACEME APP NAME Team" />

        {/* Open Graph metadata */}
        <meta
          property="og:title"
          content="REPLACEME APP NAME - Real-time Transcription and AI Summaries"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.REPLACEME APP NAME.com" />
        <meta
          property="og:image"
          content="https://www.REPLACEME APP NAME.com/og-image.png"
        />
        <meta
          property="og:description"
          content="Use Meta glasses to stream and record videos, and receive instant AI-powered summaries and transcriptions."
        />

        {/* Twitter metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@REPLACEME APP NAME" />
        <meta
          name="twitter:title"
          content="REPLACEME APP NAME - Real-time Transcription and AI Summaries"
        />
        <meta
          name="twitter:description"
          content="Capture and transcribe conversations with AI summaries using Meta glasses in real time."
        />
        <meta
          name="twitter:image"
          content="https://www.REPLACEME APP NAME.com/twitter-image.png"
        />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1>Welcome to REPLACEME APP NAME</h1>
      <p>
        Transcribe and summarize your conversations with ease using Meta
        glasses.
      </p>
    </div>
  );
};

export default HomePage;
