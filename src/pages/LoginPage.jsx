import { Helmet } from "react-helmet-async";
import { Button, Input, Label } from "@jmau949/generic-components";

const Login = () => {
  return (
    <div className="flex min-h-screen justify-center items-center bg-grey1">
      <Helmet>
        <title>REPLACEME APP NAME - Login</title>
        <meta
          name="description"
          content="Login to your REPLACEME APP NAME account to access your transcriptions, AI summaries, and recorded videos."
        />
        <meta name="robots" content="noindex, nofollow" />{" "}
        {/* Login pages are typically not indexed */}
        <meta name="author" content="REPLACEME APP NAME Team" />
        <meta property="og:title" content="REPLACEME APP NAME - Login" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.REPLACEME APP NAME.com/login"
        />
        <meta
          property="og:image"
          content="https://www.REPLACEME APP NAME.com/og-login-image.png"
        />
        <meta
          property="og:description"
          content="Login to your REPLACEME APP NAME account and manage your transcriptions, AI summaries, and videos."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@REPLACEME APP NAME" />
        <meta name="twitter:title" content="REPLACEME APP NAME - Login" />
        <meta
          name="twitter:description"
          content="Login to REPLACEME APP NAME to access your AI-powered summaries and recorded videos."
        />
        <meta
          name="twitter:image"
          content="https://www.REPLACEME APP NAME.com/twitter-login-image.png"
        />
      </Helmet>
      <div className="w-min shadow-lg rounded-xl p-5 bg-white">
        <form className="flex flex-col gap-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              autoFocus={true}
              required={true}
              name="email"
              type="email"
              id="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              required={true}
              name="password"
              type="password"
              id="password"
            />
          </div>
          <p aria-live="polite" className="text-red1">
            Error Message
          </p>
          <Button className="self-end">Sign in</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
