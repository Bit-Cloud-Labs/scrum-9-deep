import { render, screen } from '@testing-library/react';
import DashboardPage from '../dashboard/page';

// Mock child components to isolate the dashboard page
jest.mock('../../components/AttendanceRateWidget', () => {
  return function MockAttendanceRateWidget() {
    return <div data-testid="attendance-rate-widget">AttendanceRateWidget</div>;
  };
});

jest.mock('../../components/WeatherWidget', () => {
  return function MockWeatherWidget() {
    return <div data-testid="weather-widget">WeatherWidget</div>;
  };
});

jest.mock('../../components/ErrorBanner', () => {
  return function MockErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;
    return <div role="alert">{message}</div>;
  };
});

describe('DashboardPage', () => {
  it('renders the page heading', () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole('heading', { name: /baizil dashboard/i }),
    ).toBeInTheDocument();
  });

  it('renders the AttendanceRateWidget', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('attendance-rate-widget')).toBeInTheDocument();
  });

  it('renders the WeatherWidget', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  it('renders the dashboard layout container', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
