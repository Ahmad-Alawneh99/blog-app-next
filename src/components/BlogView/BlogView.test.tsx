import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import { Blog } from '../../shared/interfaces';
import { UserContext } from '../../shared/UserContext';
import { deleteBlog } from '../../app/actions';
import BlogView from './BlogView';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../app/actions');

describe('BlogView', () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      refresh: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render the blog correctly', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockAuthorId', name: 'mock author' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T20:52:47.482Z',
    };

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');
    const updateDate = DateTime.fromISO(mockBlog.updatedAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText } = render(<BlogView blog={mockBlog} />);

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock author')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(getByText(`Updated on ${updateDate}`)).toBeInTheDocument();
    });
  });

  it('should hide the update date if it\'s the same as creation date', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockAuthorId', name: 'mock author' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText, queryByText } = render(<BlogView blog={mockBlog} />);

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock author')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(queryByText(`Updated on ${publishDate}`)).toBeNull();
    });
  });

  it('should render owner controls if the user viewing the blog is the author of the blog', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockUserId', name: 'mock user' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const mockUser = {
      _id: 'mockUserId',
      name: 'mock user',
    };

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <BlogView blog={mockBlog} />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock user')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(getByText('Owner actions:')).toBeInTheDocument();
    });
  });

  it('should successfully delete a blog when performed by the owner', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockUserId', name: 'mock user' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const mockUser = {
      _id: 'mockUserId',
      name: 'mock user',
    };

    (deleteBlog as jest.Mock).mockResolvedValue({ success: true });

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <BlogView blog={mockBlog} />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock user')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(getByText('Owner actions:')).toBeInTheDocument();
    });

    const deleteButton = getByText('Delete blog');

    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it('should handle API errors when deleting a blog', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockUserId', name: 'mock user' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const mockUser = {
      _id: 'mockUserId',
      name: 'mock user',
    };

    (deleteBlog as jest.Mock).mockResolvedValue({ success: false, status: 400, message: 'mock error' });

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <BlogView blog={mockBlog} />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock user')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(getByText('Owner actions:')).toBeInTheDocument();
    });

    const deleteButton = getByText('Delete blog');

    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(getByText('mock error')).toBeInTheDocument();
    });
  });

  it('should handle thrown errors when attempting to delete a blog', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockUserId', name: 'mock user' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const mockUser = {
      _id: 'mockUserId',
      name: 'mock user',
    };

    (deleteBlog as jest.Mock).mockRejectedValue(new Error('mock thrown error'));

    const publishDate = DateTime.fromISO(mockBlog.createdAt).toFormat('dd/MM/yyyy hh:mm a');

    const { getByText } = render(
      <UserContext.Provider value={mockUser}>
        <BlogView blog={mockBlog} />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock user')).toBeInTheDocument();
      expect(getByText(`Published on ${publishDate}`)).toBeInTheDocument();
      expect(getByText('Owner actions:')).toBeInTheDocument();
    });

    const deleteButton = getByText('Delete blog');

    act(() => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(getByText('mock thrown error')).toBeInTheDocument();
    });
  });
});
