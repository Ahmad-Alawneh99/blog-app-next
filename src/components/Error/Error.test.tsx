import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import Error from './Error';

describe('Error', () => {
  it('should render Error correctly', async () => {
    const { getByText } = render(<Error title="mock title" message="mock message" />);

    await waitFor(() => {
      expect(getByText('mock title')).toBeInTheDocument();
      expect(getByText('mock message')).toBeInTheDocument();
    });
  });
});
