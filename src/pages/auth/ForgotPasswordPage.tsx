import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { forgotPassword } from "@/api/user/userService";
import { useErrorHandler } from "@/hooks/useErrorHandler";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Custom hook for forgot password logic
const useForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  const handleError = useErrorHandler({ component: "ForgotPasswordPage" });
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await forgotPassword({ email: data.email });
      setSuccess(true);
      // Optional: clear form after successful submission
      // form.reset(); - Commented out to keep email for navigation
    } catch (error: any) {
      // Use error.errorCode instead of error.message
      const errorCode: string = error.errorCode || "UnknownError";

      // Define a default user-friendly message
      let userFriendlyMessage =
        "Failed to send password reset email. Please try again.";

      // Handle specific Cognito error codes
      if (errorCode === "UserNotFoundException") {
        // If the email isn't registered, indicate success to avoid revealing user information
        setSuccess(true);
        return;
      } else if (errorCode === "InvalidParameterException") {
        userFriendlyMessage = "The email address is invalid.";
      } else if (errorCode === "LimitExceededException") {
        userFriendlyMessage = "Too many requests. Please try again later.";
      } else if (errorCode === "NetworkError") {
        userFriendlyMessage =
          "Network error. Please check your connection and try again.";
      } else {
        handleError(error, "forgotPassword");
      }

      // Set the user-friendly error message
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    success,
    setSuccess,
    onSubmit,
  };
};

const ForgotPasswordPage: React.FC = () => {
  const { form, loading, error, success, setSuccess, onSubmit } =
    useForgotPasswordForm();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus on email input when component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleProceedToReset = () => {
    const email = form.getValues().email;
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Reset Password</h1>

        {success ? (
          <div className="space-y-6">
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                If an account exists with this email, we've sent you
                instructions to reset your password. Please check your inbox and
                spam folder.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col space-y-4">
              <Button onClick={handleProceedToReset} className="w-full">
                Enter Reset Code
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full"
              >
                Return to Login
              </Button>
              <Button
                onClick={() => {
                  setSuccess(false);
                  // Don't reset form to keep the email for convenience
                }}
                variant="ghost"
                className="w-full"
              >
                Send Another Reset Link
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                      <FormDescription
                        id="email-description"
                        className="sr-only"
                      >
                        Enter the email address associated with your account
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  tabIndex={0}
                >
                  Sign in
                </Link>
              </p>
              <p className="mt-2">
                Already have a code?{" "}
                <Link
                  to="/reset-password"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  tabIndex={0}
                >
                  Reset your password
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;