import '@testing-library/jest-dom';
import {
  act,
  render,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../shared/UserContext';
import { User } from '../../shared/interfaces';
import GlobalHeader from './GlobalHeader';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../app/actions');

describe('GlobalHeader', () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      refresh: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render correctly for a logged out user', async () => {
    const { getByText } = render(
      <UserContext.Provider value={undefined}>
        <GlobalHeader />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Hello, Anonymous')).toBeInTheDocument();
      expect(getByText('Sign up')).toBeInTheDocument();
      expect(getByText('Sign in')).toBeInTheDocument();
    });
  });

  it('should render correctly for a logged in user', async () => {
    const mockUser: User = {
      _id: 'mockId',
      name: 'mock user',
    };

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <GlobalHeader />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Welcome back, mock user')).toBeInTheDocument();
      expect(getByText('My blogs')).toBeInTheDocument();
      expect(getByText('Sign out')).toBeInTheDocument();
    });
  });

  it('should sign out correctly when a user clicks on "sign out" button', async () => {
    const mockUser: User = {
      _id: 'mockId',
      name: 'mock user',
    };

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <GlobalHeader />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Welcome back, mock user')).toBeInTheDocument();
      expect(getByText('My blogs')).toBeInTheDocument();
      expect(getByText('Sign out')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(getByText('Sign out'));
    });

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
