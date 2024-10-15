import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  return (
    <div>
      <Helmet>
        <title>
          About REPLACEME APP NAME - Learn More About Our AI Transcription
          Service
        </title>
        <meta
          name="description"
          content="Find out more about REPLACEME APP NAME and how we help you transcribe and summarize meetings in real-time using AI."
        />
        <meta
          name="keywords"
          content="REPLACEME APP NAME, about, AI transcription, Meta glasses, real-time streaming"
        />
        <meta name="author" content="REPLACEME APP NAME Team" />

        {/* Open Graph metadata */}
        <meta property="og:title" content="About REPLACEME APP NAME" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.REPLACEME APP NAME.com/about"
        />
        <meta
          property="og:image"
          content="https://www.REPLACEME APP NAME.com/og-about-image.png"
        />
        <meta
          property="og:description"
          content="Find out how REPLACEME APP NAME helps you transcribe and summarize meetings using AI."
        />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1>About REPLACEME APP NAME</h1>
      <p>
        REPLACEME APP NAME provides AI-powered transcription and summarization
        services for your meetings and conversations.
      </p>
    </div>
  );
};

export default AboutPage;
