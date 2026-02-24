import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders the Baizil portal heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Baizil');
  });

  it('renders the portal description', () => {
    render(<Home />);
    expect(screen.getByText(/student portal/i)).toBeInTheDocument();
  });

  it('renders a link to the dashboard', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
  });
});
