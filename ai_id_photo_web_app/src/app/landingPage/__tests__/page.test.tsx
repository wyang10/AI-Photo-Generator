import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../../contexts/UserContext';
import LandingPage from '../page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue('/')
}));

describe('LandingPage', () => {
  const mockRouter = {
    push: jest.fn(),
    pathname: '/'
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders landing page content', () => {
    render(
      <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
        <LandingPage />
      </UserContext.Provider>
    );

    expect(screen.getByText('Create Perfect ID Photos with AI')).toBeInTheDocument();
    expect(screen.getByText('Professional ID photos for passports, visas, and documents in seconds')).toBeInTheDocument();
  });

  it('shows sign in and sign up buttons when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
        <LandingPage />
      </UserContext.Provider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('redirects to generator when logged in user clicks Get Started', () => {
    render(
      <UserContext.Provider value={{ user: { id: '1' }, setUser: jest.fn() }}>
        <LandingPage />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByText('Go to Generator'));
    expect(mockRouter.push).toHaveBeenCalledWith('/generator');
  });
});