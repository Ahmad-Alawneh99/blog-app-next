import '@testing-library/jest-dom';
import {
  act,
  render,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../app/actions';
import SignInForm from './SignInForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../app/actions');

describe('SignInForm', () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      back: jest.fn(),
      refresh: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render the form correctly', async () => {
    const { getAllByText, getByPlaceholderText } = render(<SignInForm />);

    await waitFor(() => {
      expect(getAllByText('Sign in')[0]).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });
  });

  it('should submit the form correctly when provided with input', async () => {
    (signIn as jest.Mock).mockResolvedValue({ success: true });

    const { getAllByText, getByPlaceholderText } = render(<SignInForm />);

    await waitFor(() => {
      expect(getAllByText('Sign in')[0]).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.input(getByPlaceholderText('Email'), { target: { value: 'user@domain.com' } });
      fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'Secret@123' } });
      fireEvent.click(getAllByText('Sign in')[1]);
    });

    await waitFor(() => {
      expect(mockRouter.back).toHaveBeenCalledWith();
      expect(mockRouter.refresh).toHaveBeenCalledWith();
    });
  });

  it('should display an error if the user leaves some fields missing but attempts to submit', async () => {
    const { getAllByText, getByPlaceholderText, getByText } = render(<SignInForm />);

    await waitFor(() => {
      expect(getAllByText('Sign in')[0]).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.input(getByPlaceholderText('Email'), { target: { value: 'user@domain.com' } });
      fireEvent.click(getAllByText('Sign in')[1]);
    });

    await waitFor(() => {
      expect(getByText('Email and password are required.')).toBeInTheDocument();
    });
  });

  it('should handle API errors correctly', async () => {
    (signIn as jest.Mock).mockResolvedValue({ success: false, code: 409, message: 'mock error' });

    const { getAllByText, getByPlaceholderText, getByText } = render(<SignInForm />);

    await waitFor(() => {
      expect(getAllByText('Sign in')[0]).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.input(getByPlaceholderText('Email'), { target: { value: 'user@domain.com' } });
      fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'Secret@123' } });
      fireEvent.click(getAllByText('Sign in')[1]);
    });

    await waitFor(() => {
      expect(getByText('mock error')).toBeInTheDocument();
    });
  });

  it('should handle thrown errors correctly', async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error('mock thrown error'));

    const { getAllByText, getByPlaceholderText, getByText } = render(<SignInForm />);

    await waitFor(() => {
      expect(getAllByText('Sign in')[0]).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.input(getByPlaceholderText('Email'), { target: { value: 'user@domain.com' } });
      fireEvent.input(getByPlaceholderText('Password'), { target: { value: 'Secret@123' } });
      fireEvent.click(getAllByText('Sign in')[1]);
    });

    await waitFor(() => {
      expect(getByText('mock thrown error')).toBeInTheDocument();
    });
  });
});
