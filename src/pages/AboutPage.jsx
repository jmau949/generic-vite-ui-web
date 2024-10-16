import { Helmet } from "react-helmet-async";
import MetaTags from "../components/MetaTags";
const AboutPage = () => {
  return (
    <div>
      <MetaTags
        title="About REPLACEME APP NAME - Learn More About Our AI Transcription Service"
        description="Find out more about REPLACEME APP NAME and how we help you transcribe and summarize meetings in real-time using AI."
        keywords="REPLACEME APP NAME, about, AI transcription, Meta glasses, real-time streaming"
        ogTitle="About REPLACEME APP NAME"
        ogUrl="https://www.REPLACEME APP NAME.com/about"
        ogImage="https://www.REPLACEME APP NAME.com/og-about-image.png"
        ogDescription="Find out how REPLACEME APP NAME helps you transcribe and summarize meetings using AI."
        author="REPLACEME APP NAME Team"
        robots="index, follow"
      />
      <h1>About REPLACEME APP NAME</h1>
      <p>
        REPLACEME APP NAME provides AI-powered transcription and summarization
        services for your meetings and conversations.
      </p>
    </div>
  );
};

export default AboutPage;
