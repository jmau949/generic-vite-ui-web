// __tests__/MetaTags.test.jsx
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import MetaTags from "../MetaTags";

describe("MetaTags component", () => {
  const props = {
    title: "Test Title",
    description: "Test Description",
    keywords: "test, meta, tags",
    author: "Test Author",
    ogImageUrl: "http://example.com/og-image.jpg",
    ogUrl: "http://example.com",
    twitterImageUrl: "http://example.com/twitter-image.jpg",
  };

  beforeEach(() => {
    // Clear any previously rendered head tags
    document.head.innerHTML = "";
  });

  it("renders all meta tags correctly", async () => {
    render(
      <HelmetProvider>
        <MetaTags {...props} />
      </HelmetProvider>
    );

    // Wait for the title to update
    await waitFor(() => expect(document.title).toEqual(props.title));

    // Standard meta tags
    const metaDescription = document.head.querySelector(
      'meta[name="description"]'
    );
    expect(metaDescription).toBeInTheDocument();
    expect(metaDescription.getAttribute("content")).toEqual(props.description);

    const metaKeywords = document.head.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toBeInTheDocument();
    expect(metaKeywords.getAttribute("content")).toEqual(props.keywords);

    const metaAuthor = document.head.querySelector('meta[name="author"]');
    expect(metaAuthor).toBeInTheDocument();
    expect(metaAuthor.getAttribute("content")).toEqual(props.author);

    // Open Graph meta tags
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    expect(ogTitle).toBeInTheDocument();
    expect(ogTitle.getAttribute("content")).toEqual(props.title);

    const ogType = document.head.querySelector('meta[property="og:type"]');
    expect(ogType).toBeInTheDocument();
    expect(ogType.getAttribute("content")).toEqual("website");

    const ogUrl = document.head.querySelector('meta[property="og:url"]');
    expect(ogUrl).toBeInTheDocument();
    expect(ogUrl.getAttribute("content")).toEqual(props.ogUrl);

    const ogImage = document.head.querySelector('meta[property="og:image"]');
    expect(ogImage).toBeInTheDocument();
    expect(ogImage.getAttribute("content")).toEqual(props.ogImageUrl);

    const ogDescription = document.head.querySelector(
      'meta[property="og:description"]'
    );
    expect(ogDescription).toBeInTheDocument();
    expect(ogDescription.getAttribute("content")).toEqual(props.description);

    // Twitter meta tags
    const twitterCard = document.head.querySelector(
      'meta[name="twitter:card"]'
    );
    expect(twitterCard).toBeInTheDocument();
    expect(twitterCard.getAttribute("content")).toEqual("summary_large_image");

    const twitterSite = document.head.querySelector(
      'meta[name="twitter:site"]'
    );
    expect(twitterSite).toBeInTheDocument();
    expect(twitterSite.getAttribute("content")).toEqual("@REPLACEME");

    const twitterTitle = document.head.querySelector(
      'meta[name="twitter:title"]'
    );
    expect(twitterTitle).toBeInTheDocument();
    expect(twitterTitle.getAttribute("content")).toEqual(props.title);

    const twitterDescription = document.head.querySelector(
      'meta[name="twitter:description"]'
    );
    expect(twitterDescription).toBeInTheDocument();
    expect(twitterDescription.getAttribute("content")).toEqual(
      props.description
    );

    const twitterImage = document.head.querySelector(
      'meta[name="twitter:image"]'
    );
    expect(twitterImage).toBeInTheDocument();
    expect(twitterImage.getAttribute("content")).toEqual(props.twitterImageUrl);

    // Robots meta tag
    const metaRobots = document.head.querySelector('meta[name="robots"]');
    expect(metaRobots).toBeInTheDocument();
    expect(metaRobots.getAttribute("content")).toEqual("index, follow");
  });
});
