import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Blog } from '../../shared/interfaces';
import BlogCard from './BlogCard';

describe('BlogCard', () => {
  it('should render content correctly', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockId', name: 'mock author' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const { getByText } = render(<BlogCard blog={mockBlog} />);

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(getByText('By mock author')).toBeInTheDocument();
    });
  });

  it('should not show author\'s name if hideAuthor prop is provided', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockId', name: 'mock author' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    const { getByText, queryByText } = render(<BlogCard blog={mockBlog} hideAuthor />);

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock content')).toBeInTheDocument();
      expect(queryByText('mock author')).toBeNull();
    });
  });
});
