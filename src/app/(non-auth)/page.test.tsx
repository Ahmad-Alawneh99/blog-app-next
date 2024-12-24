import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Blog } from '../../shared/interfaces';
import HomePage from './page';

describe('HomePage', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should render correctly when there is data', async () => {
    const mockBlog: Blog = {
      _id: 'mockId',
      title: 'mock title',
      content: 'mock content',
      owner: { _id: 'mockId', name: 'mock author' },
      createdAt: '2024-12-24T19:52:47.482Z',
      updatedAt: '2024-12-24T19:52:47.482Z',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true, blogs: [mockBlog] }),
    });

    const { getByText } = render(await HomePage());

    await waitFor(() => {
      expect(getByText('Welcome to Blogger!')).toBeInTheDocument();
    });
  });

  it('should render error component if the API response is not successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: false, message: 'mock error', status: 500 }),
    });

    const { getByText } = render(await HomePage());

    await waitFor(() => {
      expect(getByText('Oh no! 500!')).toBeInTheDocument();
      expect(getByText('mock error')).toBeInTheDocument();
    });
  });
});
