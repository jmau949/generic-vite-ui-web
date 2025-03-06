import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component
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

// Define schema with more detailed validation messages and password confirmation
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .max(100, { message: "Full name must be less than 100 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// Custom hook for signup logic
const useSignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const { user, signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setSignupError(null);

    try {
      await signup(data.email, data.password, data.fullName);
      // On successful signup, navigate to verification page or dashboard
      navigate("/verify-email");
    } catch (error: any) {
      console.error("Signup error", error);

      // More specific error messages
      if (error.code === "auth/email-already-in-use") {
        setSignupError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-email") {
        setSignupError("The email address is invalid.");
      } else if (error.code === "auth/weak-password") {
        setSignupError("The password is too weak.");
      } else if (error.code === "auth/network-request-failed") {
        setSignupError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setSignupError(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    signupError,
    onSubmit,
  };
};

const SignUpPage: React.FC = () => {
  const { form, loading, signupError, onSubmit } = useSignupForm();
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  // Focus on full name input when component mounts
  useEffect(() => {
    if (fullNameInputRef.current) {
      fullNameInputRef.current.focus();
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Create an Account
        </h1>

        {signupError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{signupError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullName">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-describedby="fullName-description"
                      disabled={loading}
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        if (fullNameInputRef.current !== e) {
                          fullNameInputRef.current = e;
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription
                    id="fullName-description"
                    className="sr-only"
                  >
                    Enter your full name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    />
                  </FormControl>
                  <FormDescription id="email-description" className="sr-only">
                    Enter your email address
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
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-describedby="password-description"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <FormDescription id="password-description">
                    Password must be at least 8 characters and include
                    uppercase, lowercase, number and special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-describedby="confirmPassword-description"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription
                    id="confirmPassword-description"
                    className="sr-only"
                  >
                    Confirm your password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      id="agreeToTerms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="agreeToTerms"
                      className="font-normal text-sm"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        tabIndex={0}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        tabIndex={0}
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                  </div>
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
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
              tabIndex={0}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
