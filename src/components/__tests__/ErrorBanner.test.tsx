import { render, screen } from '@testing-library/react';
import ErrorBanner from '../ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message when provided', () => {
    render(<ErrorBanner message="Failed to load attendance data" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load attendance data')).toBeInTheDocument();
  });

  it('renders nothing when no message is provided', () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorBanner message={null} />);
    expect(container.firstChild).toBeNull();
  });
});
