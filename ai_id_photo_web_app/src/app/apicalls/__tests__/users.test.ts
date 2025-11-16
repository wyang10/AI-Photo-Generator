import axios from 'axios';
import { signInUser, signUpUser } from '../users';

jest.mock('axios');

describe('User API Calls', () => {
  beforeEach(() => {
    (axios.post as jest.Mock).mockClear();
  });

  describe('signInUser', () => {
    it('successfully signs in user', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: '1', email: 'test@example.com' }
        }
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await signInUser('test@example.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users/signin'),
        {
          email: 'test@example.com',
          password: 'password123'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('handles sign in error', async () => {
      const errorMessage = 'Invalid credentials';
      (axios.post as jest.Mock).mockRejectedValueOnce({
        response: { data: errorMessage }
      });

      await expect(signInUser('test@example.com', 'wrongpass'))
        .rejects
        .toEqual(errorMessage);
    });
  });

  describe('signUpUser', () => {
    it('successfully signs up user', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }
        }
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await signUpUser('John', 'Doe', 'john@example.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users/signup'),
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});