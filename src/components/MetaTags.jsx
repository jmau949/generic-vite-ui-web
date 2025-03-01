// MetaTags.js
import { Helmet } from "react-helmet-async";

const MetaTags = ({
  title,
  description,
  keywords,
  author,
  ogImageUrl,
  ogUrl,
  twitterImageUrl,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph metadata */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:description" content={description} />

      {/* Twitter metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@REPLACEME" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImageUrl} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default MetaTags;
