import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./layouts/RootLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage")
);
const ConfirmEmailPage = lazy(() => import("./pages/auth/ConfirmEmailPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));
const TestPage = lazy(() => import("./pages/auth/TestPage"));

// Fallback UI while lazy-loaded components are loading
const Loading = () => <div>Loading...</div>;

const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Router>
            <RootLayout>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route path="/confirm-email" element={<ConfirmEmailPage />} />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/test"
                    element={
                      <PrivateRoute>
                        <TestPage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </RootLayout>
          </Router>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);

export default App;