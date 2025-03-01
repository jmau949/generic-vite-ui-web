import { Button, Input, Label } from "@jmau949/generic-components";
import { loginUser } from "../api/userMethods";
import MetaTags from "../components/MetaTags";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  message: "",
};

const LoginPage = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formAction = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await loginUser({ email, password });
      setState({ message: "Login successful!" });
      // navigate("/");
    } catch (error) {
      console.log("error", error);
      setState({ message: "Login failed. Please try again." });
    }
  };
  return (
    <div className="flex flex-col gap-10 min-h-screen justify-center items-center bg-grey1 py-14 px-6">
      <MetaTags
        title="REPLACEME APP NAME - Login"
        description="Login to your REPLACEME APP NAME account to access your transcriptions, AI summaries, and recorded videos."
        ogTitle="REPLACEME APP NAME - Login"
        ogUrl="https://www.REPLACEME APP NAME.com/login"
        ogImage="https://www.REPLACEME APP NAME.com/og-login-image.png"
        ogDescription="Login to your REPLACEME APP NAME account and manage your transcriptions, AI summaries, and videos."
        twitterTitle="REPLACEME APP NAME - Login"
        twitterDescription="Login to REPLACEME APP NAME to access your AI-powered summaries and recorded videos."
        twitterImage="https://www.REPLACEME APP NAME.com/twitter-login-image.png"
        author="REPLACEME APP NAME Team"
        robots="noindex, nofollow"
      />

      {
        // <Logo />
      }

      <div
        className="w-full shadow-lg rounded-xl p-5 bg-white dark:bg-grey4"
        style={{ maxWidth: "26rem" }}
      >
        <form onSubmit={formAction} className="flex flex-col gap-5">
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
            {state.message}
          </p>
          <div className="flex items-center justify-between">
            <a href="/sign-up" className="c-link">
              Sign up
            </a>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
