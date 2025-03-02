// __tests__/PrivateRoute.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { useAuth } from "../../auth/AuthProvider";

jest.mock("../../auth/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

describe("PrivateRoute component", () => {
  const ChildComponent = () => <div>Private Content</div>;

  it("renders loading state when loading is true", () => {
    useAuth.mockReturnValue({ loading: true, user: null });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <ChildComponent />
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders children when user is present and loading is false", () => {
    useAuth.mockReturnValue({ loading: false, user: { name: "Test User" } });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <ChildComponent />
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });

  it("navigates to login when user is not present and loading is false", () => {
    useAuth.mockReturnValue({ loading: false, user: null });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <ChildComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Expect the login page to be rendered because user is not authenticated
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
