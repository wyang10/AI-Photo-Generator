import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserProfileHistoryPage from "../page";
import { getLoggedInUserDetails } from "../../apicalls/users";
import { fetchHistoryPhotosById } from "../../apicalls/history";

// Mock API calls
jest.mock("../../apicalls/users", () => ({ 
  getLoggedInUserDetails: jest.fn(), // Mock the API call to fetch user details
})); 
jest.mock("../../apicalls/history", () => ({
  fetchHistoryPhotosById: jest.fn(), // Mock the API call to fetch user history photos
}));
jest.mock("file-saver", () => ({
  saveAs: jest.fn(), // Mock the file-saver library for testing file downloads
}));
jest.mock("jszip"); // Mock the JSZip library for testing file creation

describe("UserProfileHistoryPage", () => {
  // Clear all mocks before each test to avoid interference
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test cases will go here: Rendering the component with user details and history photos
  it("renders the component correctly", async () => {
    // Mock API responses for user details and history photos
    getLoggedInUserDetails.mockResolvedValue({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    });
    fetchHistoryPhotosById.mockResolvedValue({
      data: [
        { url: "http://example.com/photo1.jpg" },
        { url: "http://example.com/photo2.jpg" },
      ],
    });

    // Render the component
    render(<UserProfileHistoryPage />);

    // Check if user details are displayed correctly
    expect(await screen.findByText(/Welcome, John/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/john.doe@example.com/i)
    ).toBeInTheDocument();

    // Check if photos are displayed correctly
    expect(await screen.findByAltText(/Photo 1/i)).toBeInTheDocument();
    expect(await screen.findByAltText(/Photo 2/i)).toBeInTheDocument();
  });

  // Test case: Rendering when no photos are available
  it("displays 'No photos' when there are no photos", async () => {
    // Mock API responses
    getLoggedInUserDetails.mockResolvedValue({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
      },
    });
    fetchHistoryPhotosById.mockResolvedValue({ data: [] }); // No photos

    // Render the component
    render(<UserProfileHistoryPage />);

    // Check if "No photos" message is displayed
    expect(await screen.findByText(/No photos/i)).toBeInTheDocument();
  });

  // Test case: Downloading a photo
  it("handles image download correctly", async () => {
    // Mock `fetch` to simulate image fetching from the server
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(["image data"])), // Simulate a successful image fetch
      })
    );

    // Mock API responses for user details and a single history photo
    getLoggedInUserDetails.mockResolvedValue({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    });

    fetchHistoryPhotosById.mockResolvedValue({
      data: [{ url: "http://example.com/photo1.jpg" }],
    });

    // Render the component
    render(<UserProfileHistoryPage />);

    // Wait for the photo to load
    const photoElement = await screen.findByAltText(/Photo 1/i);
    expect(photoElement).toBeInTheDocument();

    // Simulate clicking the download icon for the photo
    const downloadIcon = photoElement.nextSibling.querySelector(".faDownload");
    expect(downloadIcon).toBeInTheDocument();
    fireEvent.click(downloadIcon);

    // Check if the download function is called with the correct URL
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("undefined/photo/proxy?url=http%3A%2F%2Fexample.com%2Fphoto1.jpg")
      );
    });
  });

  // Test case: Rendering the avatar image from user details
  it("handles avatar loading correctly", async () => {
    // Mock API responses for user details including an avatar image
    getLoggedInUserDetails.mockResolvedValue({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "http://example.com/avatar.jpg",
      },
    });

    // Render the component
    render(<UserProfileHistoryPage />);

    // Check if the avatar image is rendered with correct source
    const avatarImage = await screen.findByAltText(/avatar/i);
    expect(avatarImage).toHaveAttribute(
      "src",
      "/images/exampleImage/avatar.png"
    );
  });

  // Test case: Handling avatar fallback when avatar is missing
  it("handles avatar fallback", async () => {
    // Mock API responses with no avatar in user details
    getLoggedInUserDetails.mockResolvedValue({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    });

    // Render the component
    render(<UserProfileHistoryPage />);

    // Check if the default avatar is used as fallback
    const avatarImage = await screen.findByAltText(/avatar/i);
    expect(avatarImage).toHaveAttribute(
      "src",
      "/images/exampleImage/avatar.png"
    );
  });
});
