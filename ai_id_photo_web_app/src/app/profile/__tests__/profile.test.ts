import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "../page";
import { getLoggedInUserDetails, updateUser, signoutUser } from "../../apicalls/users";
import { useRouter } from "next/navigation";

// Mock API calls
jest.mock("../../apicalls/users", () => ({
    getLoggedInUserDetails: jest.fn(),
    updateUser: jest.fn(),
    signoutUser: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
    usePathname: jest.fn(() => "/profile"),
}));

const mockRouterPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
    push: mockRouterPush,
});

describe("ProfilePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the ProfilePage component correctly", async () => {
        // Mock user data
        (getLoggedInUserDetails as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                avatar: "/images/avatar-default.png",
                gender: "Male",
                country: "USA",
            },
        });

        render(React.createElement(ProfilePage));

        // Wait for user data to load
        await waitFor(() => expect(screen.getByText(/Welcome, John/i)).toBeInTheDocument());
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
        const genderSelect = screen.getByTestId("gender-select");
        expect(genderSelect).toHaveValue("Male");
        expect(screen.getByTestId("country-input")).toBeInTheDocument();
    });

    it("allows editing and saving profile information", async () => {
        (getLoggedInUserDetails as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                avatar: "/images/avatar-default.png",
                gender: "Male",
                country: "USA",
            },
        });

        (updateUser as jest.Mock).mockResolvedValue({
            success: true,
            message: "Profile updated successfully",
        });

        render(React.createElement(ProfilePage));

        // Wait for user data to load
        await waitFor(() => screen.getByText(/Welcome, John/i));

        // Click on "Edit" button
        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);

        // Edit fields
        const firstNameInput = screen.getByPlaceholderText(/Your First Name/i);
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });

        const lastNameInput = screen.getByPlaceholderText(/Your Last Name/i);
        fireEvent.change(lastNameInput, { target: { value: "Smith" } });

        const genderSelect = screen.getByDisplayValue(/Male/i);
        fireEvent.change(genderSelect, { target: { value: "Female" } });

        const countryInput = screen.getByPlaceholderText(/Your Country/i);
        fireEvent.change(countryInput, { target: { value: "Canada" } });

        // Click on "Save" button
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        // Assert API call and state update
        await waitFor(() => expect(updateUser).toHaveBeenCalledWith({
            firstName: "Jane",
            lastName: "Smith",
            gender: "Female",
            country: "Canada",
        }));

        const updatedWelcomeMessage = await screen.findByText(/Welcome, Jane/i);
        expect(updatedWelcomeMessage).toBeInTheDocument();
    });

    it("resets fields on cancel during edit mode", async () => {
        (getLoggedInUserDetails as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                avatar: "/images/avatar-default.png",
                gender: "Male",
                country: "USA",
            },
        });

        render(React.createElement(ProfilePage));

        // Wait for user data to load
        await waitFor(() => screen.getByText(/Welcome, John/i));

        // Click on "Edit" button
        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);

        // Edit fields
        const firstNameInput = screen.getByPlaceholderText(/Your First Name/i);
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });

        // Click "Cancel" button
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        // Assert that the fields reset to original data
        expect(firstNameInput).toHaveValue("John");
    });

    it("handles signout and redirects to sign-in page", async () => {
        render(React.createElement(ProfilePage));

        // Click on "Signout" button
        const signoutButton = screen.getByText(/Signout/i);
        fireEvent.click(signoutButton);

        // Assert API call and redirection
        expect(signoutUser).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith("/signIn");
    });
});
