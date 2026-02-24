import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

describe('Home', () => {
  it('renders the Baizil heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Baizil');
  });

  it('renders the student portal description', () => {
    render(<Home />);
    expect(screen.getByText(/student portal/i)).toBeInTheDocument();
  });

  it('renders a link to the dashboard', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /open dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
