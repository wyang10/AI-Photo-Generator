import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../page";
import { UserContext } from "../../../contexts/UserContext";
import { signUpUser } from "../../apicalls/users";
import { useRouter } from "next/navigation";

jest.mock("../../apicalls/users", () => ({
  signUpUser: jest.fn(),
  googleSignIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRouterPush = jest.fn();
const mockSetUser = jest.fn();

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders SignUp component correctly", () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignUp />
      </UserContext.Provider>
    );

    // Check for the form and inputs
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  it("handles input changes correctly", () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignUp />
      </UserContext.Provider>
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("shows an error when passwords do not match", async () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignUp />
      </UserContext.Provider>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByText(/Create Account/i);

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });

    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  it("handles successful signup", async () => {
    signUpUser.mockResolvedValue({
      data: { email: "test@example.com" },
    });

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignUp />
      </UserContext.Provider>
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByText(/Create Account/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledWith(
        "John",
        "Doe",
        "john.doe@example.com",
        "password123"
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/landingPage");
    });
  });

  it("handles signup errors gracefully", async () => {
    signUpUser.mockRejectedValue(new Error("Failed to create account"));

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <SignUp />
      </UserContext.Provider>
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByText(/Create Account/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Error creating account. Please try again/i)
    ).toBeInTheDocument();
  });
});
