import { Helmet } from "react-helmet-async";
import MetaTags from "../components/MetaTags";
const ContactPage = () => {
  return (
    <div>
      <MetaTags
        title="Contact REPLACEME APP NAME - Get in Touch with Us"
        description="Have any questions? Contact the REPLACEME APP NAME team for support and more information."
        keywords="REPLACEME APP NAME, contact, support, help, AI transcription"
        ogTitle="Contact REPLACEME APP NAME"
        ogUrl="REPLACEMECONTENT"
        ogImage="REPLACEME CONTACT IMAGE"
        ogDescription="Have questions? Contact the REPLACEME APP NAME team for support and information."
        author="REPLACEME APP NAME Team"
        robots="index, follow"
      />
      <h1>Contact REPLACEME APP NAME</h1>
      <p>
        If you need any support or information, feel free to contact us at
        support@REPLACEME APP NAME.com.
      </p>
    </div>
  );
};

export default ContactPage;
