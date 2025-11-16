import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../page";
import { UserContext } from "../../../contexts/UserContext";
import { signInUser } from "../../apicalls/users";
import { useRouter } from "next/navigation";

jest.mock("../../apicalls/users", () => ({
  signInUser: jest.fn(),
  googleSignIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignIn Component", () => {
  const mockSetUser = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders the SignIn component correctly", () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignIn />
      </UserContext.Provider>
    );

    expect(
      screen.getByText(/Login to access your ID Photo Generator account/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignIn />
      </UserContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText("********");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("handles successful login", async () => {
    signInUser.mockResolvedValue({
      data: { token: "mock-token", user: { email: "test@example.com" } },
    });

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignIn />
      </UserContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByTestId("login-button");
    const passwordInput = screen.getByPlaceholderText("********");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(mockSetUser).toHaveBeenCalledWith({
        token: "mock-token",
        user: { email: "test@example.com" },
      })
    );

    expect(mockRouterPush).toHaveBeenCalledWith("/landingPage");
  });

  it("handles login failure", async () => {
    signInUser.mockRejectedValue(new Error("Invalid email or password"));

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignIn />
      </UserContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByTestId("login-button");
    const passwordInput = screen.getByPlaceholderText("********");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument()
    );
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("loads saved email from localStorage", () => {
    localStorage.setItem("savedEmail", "saved@example.com");

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignIn />
      </UserContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    expect(emailInput).toHaveValue("saved@example.com");

    localStorage.removeItem("savedEmail"); // Clean up
  });
});
