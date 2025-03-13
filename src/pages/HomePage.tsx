import React, { useState } from "react";
import MetaTags from "../components/MetaTags";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const HomePage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Navigate or handle submission
      console.log("Submitted:", inputValue);
      // navigate("/chat", { state: { initialMessage: inputValue } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <MetaTags title="AI Assistant" description="Your personal AI assistant" />

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-12">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
            How can I help?
          </h1>
          <div className="w-full max-w-xl mt-8">
            <Card className="p-1 shadow-md">
              <div className="relative">
                <Textarea
                  placeholder="Message..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  className={`w-full pr-12 border-0 shadow-none resize-none focus:ring-0 ${
                    isExpanded ? "min-h-32" : "min-h-16"
                  } transition-all duration-200`}
                />
                <Button
                  className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                  </svg>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

// The MetaTags component below injects a variety of SEO-friendly tags:
// - Title: Sets the page title (displayed in search results and browser tabs).
// - Description: Provides a summary of the page.
// - Keywords: Lists important terms (less critical but can be used).
// - Author: Indicates who created the content.
// - Canonical: Points to the preferred version of the URL.
// - Hreflang: Helps search engines serve the correct regional or language URL.
// - Structured Data: Provides JSON-LD for rich search results.
// - Open Graph and Twitter tags: Optimize social sharing displays.

// <MetaTags
// title="REPLACEME"
// description="REPLACEME"
// keywords="REPLACEME"
// author="REPLACEME"
// ogImageUrl="REPLACEME"
// ogUrl="REPLACEME"
// twitterImageUrl="REPLACEME"
// />
