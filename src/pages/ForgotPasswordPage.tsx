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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPassword, confirmForgotPassword } from "@/api/user/userService";

// Form validation schemas
const requestSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

const confirmSchema = z
  .object({
    code: z.string().min(6, { message: "Code must be 6 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestFormValues = z.infer<typeof requestSchema>;
type ConfirmFormValues = z.infer<typeof confirmSchema>;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetStep, setResetStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState<string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Request form
  const requestForm = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  // Confirm form
  const confirmForm = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  // Focus email input on initial render
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log("email", email);
  });
  // Handle request password reset
  const handleRequestReset = async (data: RequestFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // await resetPassword({ email: data.email });
      setEmail(data.email);
      setResetStep("confirm");
    } catch (error: any) {
      // Don't reveal if email exists for security
      if (error.message?.includes("no registered/verified email")) {
        setResetStep("confirm");
        return;
      }

      // Error message handling
      let userFriendlyMessage =
        "Failed to send password reset email. Please try again.";

      if (error.message?.includes("Invalid parameter in request")) {
        userFriendlyMessage = "The email address is invalid.";
      } else if (error.message?.includes("Attempt limit exceeded")) {
        userFriendlyMessage = "Too many requests. Please try again later.";
      } else if (error.message?.includes("Network error")) {
        userFriendlyMessage =
          "Network error. Please check your connection and try again.";
      }

      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm password reset
  const handleConfirmReset = async (data: ConfirmFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await confirmForgotPassword({
        email,
        code: data.code,
        password: data.password,
      });
      navigate("/login");
    } catch (error: any) {
      setError(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">
          {resetStep === "request"
            ? "Reset Password"
            : "Enter Verification Code"}
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetStep === "request" ? (
          <>
            <p className="mb-6 text-gray-600">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>

            <Form {...requestForm}>
              <form
                onSubmit={requestForm.handleSubmit(handleRequestReset)}
                className="space-y-6"
              >
                <FormField
                  control={requestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          disabled={loading}
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            emailInputRef.current = e;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !requestForm.formState.isValid}
                >
                  {loading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              We've sent a verification code to your email. Enter it below along
              with your new password.
            </p>

            <Form {...confirmForm}>
              <form
                onSubmit={confirmForm.handleSubmit(handleConfirmReset)}
                className="space-y-6"
              >
                <FormField
                  control={confirmForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="off"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={confirmForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={confirmForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !confirmForm.formState.isValid}
                >
                  {loading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}

        <div className="mt-6 text-center">
          <p>
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;