import { render, screen } from '@testing-library/react';
import ErrorBanner from '../ErrorBanner';

describe('ErrorBanner', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorBanner message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when message is empty string', () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the error message when provided', () => {
    render(<ErrorBanner message="Failed to load attendance data" />);
    expect(
      screen.getByText('Failed to load attendance data'),
    ).toBeInTheDocument();
  });

  it('renders with role alert for accessibility', () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays a generic error when message is provided', () => {
    render(<ErrorBanner message="Weather API error" />);
    expect(screen.getByText('Weather API error')).toBeInTheDocument();
  });
});
