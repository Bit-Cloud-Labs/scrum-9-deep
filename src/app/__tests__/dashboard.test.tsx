import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../dashboard/page';

// Mock child components so dashboard tests focus on layout
jest.mock('../../components/AttendanceRateWidget', () => {
  return function MockAttendanceRateWidget() {
    return <div data-testid="attendance-widget">AttendanceRateWidget</div>;
  };
});

jest.mock('../../components/WeatherWidget', () => {
  return function MockWeatherWidget() {
    return <div data-testid="weather-widget">WeatherWidget</div>;
  };
});

describe('DashboardPage', () => {
  it('renders the page heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /baizil/i })).toBeInTheDocument();
  });

  it('renders the AttendanceRateWidget', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('attendance-widget')).toBeInTheDocument();
  });

  it('renders the WeatherWidget', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  it('renders a subtitle or description', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/staff portal/i)).toBeInTheDocument();
  });
});
