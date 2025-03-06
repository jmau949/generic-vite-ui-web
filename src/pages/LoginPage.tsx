import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schema with more detailed validation messages
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Custom hook for login logic
const useLoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const { user, login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  const isLocked = loginAttempts >= 5;
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetLockout = useCallback(() => {
    setLoginAttempts(0);
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }

    // Clean up any timeout on unmount
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [user, navigate, resetLockout]);

  // Reset lockout after 15 minutes
  useEffect(() => {
    if (isLocked && !lockTimeoutRef.current) {
      lockTimeoutRef.current = setTimeout(() => {
        resetLockout();
      }, 15 * 60 * 1000);
    }
  }, [isLocked, resetLockout]);

  const onSubmit = async (data: LoginFormValues) => {
    if (isLocked) {
      setLoginError("Too many failed attempts. Please try again later.");
      return;
    }

    setLoading(true);
    setLoginError(null);

    try {
      await login(data.email, data.password);
      // Reset login attempts on success
      resetLockout();
      navigate("/");
    } catch (error: any) {
      console.error("Login error", error);
      // Increment failed login attempts
      setLoginAttempts((prev) => prev + 1);

      // More specific error messages
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setLoginError("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        setLoginError(
          "Too many failed login attempts. Please try again later."
        );
      } else if (error.code === "auth/user-disabled") {
        setLoginError(
          "This account has been disabled. Please contact support."
        );
      } else if (error.code === "auth/network-request-failed") {
        setLoginError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setLoginError(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    loginError,
    isLocked,
    onSubmit,
  };
};

const LoginPage: React.FC = () => {
  const { form, loading, loginError, isLocked, onSubmit } = useLoginForm();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus on email input when component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign In</h1>

        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        {isLocked && (
          <Alert variant="warning" className="mb-4">
            <AlertDescription>
              Your account has been temporarily locked due to multiple failed
              login attempts. Please try again later or reset your password.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="your.email@example.com"
                      type="email"
                      autoComplete="email"
                      aria-describedby="email-description"
                      disabled={loading || isLocked}
                      {...field}
                      ref={(e) => {
                        // Handle both the ref from react-hook-form and our custom ref
                        field.ref(e);
                        if (emailInputRef.current !== e) {
                          emailInputRef.current = e;
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription id="email-description" className="sr-only">
                    Enter the email address associated with your account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                      tabIndex={0}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-describedby="password-description"
                      disabled={loading || isLocked}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription
                    id="password-description"
                    className="sr-only"
                  >
                    Enter your password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || isLocked || !form.formState.isValid}
              aria-disabled={loading || isLocked || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800"
              tabIndex={0}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
