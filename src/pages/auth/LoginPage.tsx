import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
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
import { useErrorHandler } from "@/hooks/useErrorHandler";

// Define schema with detailed validation messages
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

// Custom hook for login logic (without lockout logic)
const useLoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { user, login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleError = useErrorHandler({ component: "LoginPage" });
  const commonErrorCodes = [
    "UserNotConfirmedException",
    "PasswordResetRequiredException",
    "NotAuthorizedException",
    "UserNotFoundException",
  ];
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setLoginError(null);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error: any) {
      if (error?.message?.includes("User not confirmed")) {
        // Navigate to confirm email page, passing along the email
        navigate("/confirm-email", { state: { email: data.email } });
        return; // Early return to avoid further error processing
      }
      if (error?.message?.includes("Password reset required")) {
        // Navigate to reset password page, passing along the email
        navigate("/reset-password", { state: { email: data.email } });
        return; // Early return
      }
      setLoginError(error.message || "An unexpected error occurred");

      // Check error.errorCode against common Cognito exceptions

      if (error.errorCode && !commonErrorCodes.includes(error.errorCode)) {
        handleError(error, "login");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    loginError,
    onSubmit,
  };
};

const LoginPage: React.FC = () => {
  const { form, loading, loginError, onSubmit } = useLoginForm();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus on email input when component mounts
  useEffect(() => {
    emailInputRef.current?.focus();
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
                      disabled={loading}
                      {...field}
                      ref={(e) => {
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
                      disabled={loading}
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
              disabled={loading || !form.formState.isValid}
              aria-disabled={loading || !form.formState.isValid}
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
