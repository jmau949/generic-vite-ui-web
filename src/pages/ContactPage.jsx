import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <div>
      <Helmet>
        <title>Contact REPLACEME APP NAME - Get in Touch with Us</title>
        <meta
          name="description"
          content="Have any questions? Contact the REPLACEME APP NAME team for support and more information."
        />
        <meta
          name="keywords"
          content="REPLACEME APP NAME, contact, support, help, AI transcription"
        />
        <meta name="author" content="REPLACEME APP NAME Team" />

        {/* Open Graph metadata */}
        <meta property="og:title" content="Contact REPLACEME APP NAME" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="REPLACEMECONTENT" />
        <meta
          property="og:image"
          content="REPLACEME CONTACT IMAGE"
          //   content="https://www.REPLACEME APP NAME.com/og-contact-image.png"
        />
        <meta
          property="og:description"
          content="Have questions? Contact the REPLACEME APP NAME team for support and information."
        />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1>Contact REPLACEME APP NAME</h1>
      <p>
        If you need any support or information, feel free to contact us at
        support@REPLACEME APP NAME.com.
      </p>
    </div>
  );
};

export default ContactPage;
