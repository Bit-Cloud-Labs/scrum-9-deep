import { render, screen, act, waitFor } from '@testing-library/react';
import WeatherWidget from '../WeatherWidget';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockClear();
  mockGeolocation.getCurrentPosition.mockClear();
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('WeatherWidget', () => {
  it('shows loading state initially', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // never resolves
    });

    render(<WeatherWidget />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays weather data on success', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 51.5, longitude: -0.1 } });
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        temperature: 18,
        condition: 'Cloudy',
        location: 'London',
      }),
    });

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/18/)).toBeInTheDocument();
      expect(screen.getByText(/cloudy/i)).toBeInTheDocument();
      expect(screen.getByText(/london/i)).toBeInTheDocument();
    });
  });

  it('shows error when geolocation is denied', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((_success, error) => {
      error({ message: 'User denied geolocation' });
    });

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
    });
  });

  it('shows error when weather fetch fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 51.5, longitude: -0.1 } });
    });

    mockFetch.mockRejectedValueOnce(new Error('API error'));

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load weather/i)).toBeInTheDocument();
    });
  });

  it('shows error when weather response is not ok', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 51.5, longitude: -0.1 } });
    });

    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load weather/i)).toBeInTheDocument();
    });
  });

  it('auto-refreshes after 10 minutes', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 51.5, longitude: -0.1 } });
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 18, condition: 'Cloudy', location: 'London' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ temperature: 22, condition: 'Sunny', location: 'London' }),
      });

    render(<WeatherWidget />);

    await waitFor(() => {
      expect(screen.getByText(/cloudy/i)).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(600000);
    });

    await waitFor(() => {
      expect(screen.getByText(/sunny/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
