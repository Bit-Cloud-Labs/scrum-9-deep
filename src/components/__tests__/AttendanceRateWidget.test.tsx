import { render, screen, act, waitFor } from '@testing-library/react';
import AttendanceRateWidget from '../AttendanceRateWidget';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AttendanceRateWidget', () => {
  it('displays attendance rate on successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rate: 87.5 }),
    });

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/87\.5%/)).toBeInTheDocument();
    });
  });

  it('shows a loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rate: 90 }),
    });

    render(<AttendanceRateWidget />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays an error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load attendance/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load attendance/i)).toBeInTheDocument();
    });
  });

  it('auto-refreshes after 30 seconds', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rate: 80 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rate: 95 }),
      });

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/80%/)).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(screen.getByText(/95%/)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
