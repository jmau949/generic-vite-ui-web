import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import MetaTags from "../components/MetaTags";

const LoginPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
    } catch (error: any) {
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

      <div className="bg-blue-500 text-white p-4 text-center rounded-lg shadow-lg">
        Tailwind is working!
      </div>
      <div
        className="w-full shadow-lg rounded-xl p-5 bg-white dark:bg-grey4"
        style={{ maxWidth: "26rem" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email">Email</label>
            <input autoFocus required name="email" type="email" id="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input required name="password" type="password" id="password" />
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
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
