import { render, screen, waitFor, act } from '@testing-library/react';
import WeatherWidget from '../WeatherWidget';

// --- Geolocation mock helpers ---
const mockGeolocationSuccess = (lat = 51.5074, lon = -0.1278) => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn((successCb) => {
        successCb({ coords: { latitude: lat, longitude: lon } });
      }),
    },
    configurable: true,
    writable: true,
  });
};

const mockGeolocationError = (message = 'Permission denied') => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn((_successCb, errorCb) => {
        errorCb({ message });
      }),
    },
    configurable: true,
    writable: true,
  });
};

const mockGeolocationUnsupported = () => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: undefined,
    configurable: true,
    writable: true,
  });
};

// --- Fetch mock helpers ---
const mockWeatherResponse = {
  name: 'London',
  main: { temp: 15.3, humidity: 72 },
  weather: [{ description: 'light rain', icon: '10d' }],
  wind: { speed: 5.1 },
};

const mockFetchSuccess = () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockWeatherResponse,
  } as unknown as Response);
};

const mockFetchFailure = (status = 500) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ message: 'Internal Server Error' }),
  } as unknown as Response);
};

const mockFetchNetworkError = () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));
};

beforeEach(() => {
  jest.useFakeTimers();
  mockGeolocationSuccess();
  mockFetchSuccess();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('WeatherWidget', () => {
  describe('initial render', () => {
    it('shows a loading state while fetching weather', async () => {
      // Make fetch never resolve during the loading check
      global.fetch = jest.fn().mockImplementation(
        () => new Promise(() => {}) // pending forever
      );
      render(<WeatherWidget />);
      expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
    });

    it('displays weather data after successful fetch', async () => {
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByText(/London/i)).toBeInTheDocument()
      );
      expect(screen.getByText(/15/)).toBeInTheDocument();
      expect(screen.getByText(/light rain/i)).toBeInTheDocument();
    });

    it('renders a weather widget heading', async () => {
      render(<WeatherWidget />);
      expect(screen.getByRole('heading', { name: /weather/i })).toBeInTheDocument();
    });
  });

  describe('geolocation handling', () => {
    it('shows geolocation error when geolocation is denied', async () => {
      mockGeolocationError('Permission denied');
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/location/i);
    });

    it('shows geolocation unavailable error when not supported', async () => {
      mockGeolocationUnsupported();
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/not supported/i);
    });
  });

  describe('API error handling', () => {
    it('shows an error message when the weather API fails', async () => {
      mockGeolocationSuccess();
      mockFetchFailure(500);
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/weather/i);
    });

    it('shows an error message on network error', async () => {
      mockGeolocationSuccess();
      mockFetchNetworkError();
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/weather/i);
    });
  });

  describe('auto-refresh', () => {
    it('re-fetches weather data every 30 seconds', async () => {
      render(<WeatherWidget />);
      // Initial fetch
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

      // Advance 30 seconds
      act(() => {
        jest.advanceTimersByTime(30_000);
      });
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

      // Advance another 30 seconds
      act(() => {
        jest.advanceTimersByTime(30_000);
      });
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
    });

    it('clears the interval on unmount', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const { unmount } = render(<WeatherWidget />);
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('display details', () => {
    it('displays city name', async () => {
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByText(/London/i)).toBeInTheDocument()
      );
    });

    it('displays temperature', async () => {
      render(<WeatherWidget />);
      await waitFor(() => expect(screen.getByText(/15/)).toBeInTheDocument());
    });

    it('displays weather description', async () => {
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByText(/light rain/i)).toBeInTheDocument()
      );
    });

    it('displays humidity', async () => {
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByText(/72/)).toBeInTheDocument()
      );
    });

    it('displays wind speed', async () => {
      render(<WeatherWidget />);
      await waitFor(() =>
        expect(screen.getByText(/5/)).toBeInTheDocument()
      );
    });
  });
});
