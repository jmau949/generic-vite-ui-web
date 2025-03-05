import React from "react";
import MetaTags from "../components/MetaTags";

const HomePage: React.FC = () => {
  return (
    <div>
      {/*
        The MetaTags component below injects a variety of SEO-friendly tags:
        - Title: Sets the page title (displayed in search results and browser tabs).
        - Description: Provides a summary of the page.
        - Keywords: Lists important terms (less critical but can be used).
        - Author: Indicates who created the content.
        - Canonical: Points to the preferred version of the URL.
        - Hreflang: Helps search engines serve the correct regional or language URL.
        - Structured Data: Provides JSON-LD for rich search results.
        - Open Graph and Twitter tags: Optimize social sharing displays.
      */}
      <MetaTags
        title="REPLACEME"
        description="REPLACEME"
        keywords="REPLACEME"
        author="REPLACEME"
        ogImageUrl="REPLACEME"
        ogUrl="REPLACEME"
        twitterImageUrl="REPLACEME"
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
