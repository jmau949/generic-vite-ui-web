import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Button, Input, Label } from "@jmau949/generic-components";
import MetaTags from "../components/MetaTags";

const LoginPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Use login function from AuthProvider

  // ✅ Use `useEffect` to handle redirection (fixes navigation issue)
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password); // ✅ Use AuthProvider's `login`
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
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

      <div
        className="w-full shadow-lg rounded-xl p-5 bg-white dark:bg-grey4"
        style={{ maxWidth: "26rem" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input autoFocus required name="email" type="email" id="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input required name="password" type="password" id="password" />
          </div>
          {message && (
            <p aria-live="polite" className="text-red1">
              {message}
            </p>
          )}
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
