import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GeneratorPage from '../page';
import { getLoggedInUserDetails } from '../../apicalls/users';

// Mocking API calls and other dependencies
jest.mock('../../apicalls/users', () => ({
    getLoggedInUserDetails: jest.fn(),
}));

jest.mock('axios');

describe('GeneratorPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders GeneratorPage components correctly', async () => {
        // Mock user data
        (getLoggedInUserDetails as jest.Mock).mockResolvedValue({
            data: { _id: 'user123', firstName: 'Test User' },
        });

        // Render the component
        await act(async () => {
            render(React.createElement(GeneratorPage));
        });

        // Check if the NavigationBar, welcome message, and upload section are present
        expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/Drop Image Here/i)).toBeInTheDocument();
        expect(screen.getByText(/Generate/i)).toBeInTheDocument();
    });

    it('loads user data and sets it correctly', async () => {
        const mockUser = { _id: 'user123', firstName: 'John' };
        (getLoggedInUserDetails as jest.Mock).mockResolvedValue({ data: mockUser });

        await act(async () => {
            render(React.createElement(GeneratorPage));
        });

        // Assert that user data is displayed
        expect(screen.getByText(`Welcome, ${mockUser.firstName}`)).toBeInTheDocument();
    });

    it('handles file upload correctly', async () => {
        const file = new File(['dummy image'], 'example.jpg', { type: 'image/jpeg' });

        // Mock createObjectURL for test environment
        global.URL.createObjectURL = jest.fn(() => 'mock-url');

        render(React.createElement(GeneratorPage));
        const dropZone = screen.getByTestId('file-input');

        await act(async () => {
            fireEvent.change(dropZone, { target: { files: [file] } });
        });

        const imageState = await screen.findByAltText(/Selected/i);

        // Wait for the DOM to update and check if the uploaded image is displayed
        expect(imageState).toBeInTheDocument();
    });
});
