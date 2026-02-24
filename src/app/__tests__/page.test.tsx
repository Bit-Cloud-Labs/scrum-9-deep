import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders the welcome heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome');
  });

  it('renders the description', () => {
    render(<Home />);
    expect(screen.getByText('OpenClaw Next.js application.')).toBeInTheDocument();
  });
});
