import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Check if user exists and is not verified
  useEffect(() => {
    if (user?.emailVerified) {
      // User is already verified, redirect to dashboard
      setVerificationStatus("success");
      setStatusMessage("Your email has been verified successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  }, [user, navigate]);

  // Countdown timer for resending verification email
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend]);

  // Function to check email verification status
  const checkVerificationStatus = async () => {
    setLoading(true);
    setStatusMessage("");

    try {
      // Force refresh the user to check if email has been verified
      if (user) {
        await user.reload();

        if (user?.emailVerified) {
          setVerificationStatus("success");
          setStatusMessage("Your email has been verified successfully!");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setStatusMessage(
            "Your email is not verified yet. Please check your inbox."
          );
        }
      }
    } catch (error: any) {
      console.error("Verification check error", error);
      setVerificationStatus("error");
      setStatusMessage(
        error.message || "An error occurred while checking verification status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to resend verification email
  const handleResendVerification = async () => {
    setResendLoading(true);
    setStatusMessage("");

    try {
      if (user) {
        await sendEmailVerification(user);
        setStatusMessage("Verification email has been resent to your inbox");
        setCanResend(false);
        setCountdown(60);
      }
    } catch (error: any) {
      console.error("Resend verification error", error);
      setVerificationStatus("error");

      if (error.code === "auth/too-many-requests") {
        setStatusMessage("Too many attempts. Please try again later.");
      } else {
        setStatusMessage(
          error.message || "Failed to resend verification email"
        );
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const renderStatusIcon = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        );
      case "error":
        return <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />;
      default:
        return <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a verification link to {user?.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStatusIcon()}

          {statusMessage && (
            <Alert
              variant={
                verificationStatus === "error" ? "destructive" : "default"
              }
              className={
                verificationStatus === "success"
                  ? "bg-green-50 border-green-200"
                  : ""
              }
            >
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Please check your email inbox and click on the verification link
              to confirm your email address.
            </p>
            <p className="text-sm text-gray-500">
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={checkVerificationStatus}
              disabled={loading}
              aria-disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Checking...</span>
                </>
              ) : (
                "I've verified my email"
              )}
            </Button>

            <Button
              onClick={handleResendVerification}
              disabled={resendLoading || !canResend}
              aria-disabled={resendLoading || !canResend}
              variant="ghost"
              className="w-full flex items-center justify-center"
            >
              {resendLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Sending...</span>
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Resend verification email</span>
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Resend in {countdown}s</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-center w-full text-sm text-gray-500">
            <Button variant="link" onClick={handleLogout} className="text-sm">
              Use a different account
            </Button>
            <span className="mx-2">•</span>
            <Link
              to="/contact-support"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Need help?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmEmailPage;
