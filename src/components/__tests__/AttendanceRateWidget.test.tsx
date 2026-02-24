/**
 * Tests for AttendanceRateWidget component.
 * Covers: initial fetch, auto-refresh, and error handling.
 */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttendanceRateWidget from '../AttendanceRateWidget';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper to create a successful fetch response
const makeFetchSuccess = (rate: number) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ rate }),
  } as Response);

// Helper to create a failed fetch response (non-ok HTTP status)
const makeFetchError = () =>
  Promise.resolve({
    ok: false,
    status: 500,
    json: () => Promise.resolve({ error: 'Internal Server Error' }),
  } as Response);

describe('AttendanceRateWidget', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<AttendanceRateWidget />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays the attendance rate after a successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ rate: 87.5 }),
    } as Response);

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/87\.5/)).toBeInTheDocument();
    });
    expect(screen.getByText(/attendance rate/i)).toBeInTheDocument();
  });

  it('displays an error message when the fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as Response);

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load attendance/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when the fetch throws (network error)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load attendance/i)).toBeInTheDocument();
    });
  });

  it('auto-refreshes the attendance rate every 30 seconds', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rate: 75 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rate: 90 }),
      } as Response);

    render(<AttendanceRateWidget />);

    // Wait for initial fetch
    await waitFor(() => {
      expect(screen.getByText(/75/)).toBeInTheDocument();
    });

    // Advance timer by 30 seconds to trigger auto-refresh
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(screen.getByText(/90/)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('shows updated data after recovering from an error on refresh', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rate: 82 }),
      } as Response);

    render(<AttendanceRateWidget />);

    // First fetch fails
    await waitFor(() => {
      expect(screen.getByText(/failed to load attendance/i)).toBeInTheDocument();
    });

    // Advance timer for auto-refresh
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    // Second fetch succeeds
    await waitFor(() => {
      expect(screen.getByText(/82/)).toBeInTheDocument();
    });
  });

  it('clears the auto-refresh interval on unmount', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rate: 70 }),
    } as Response);

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<AttendanceRateWidget />);

    await waitFor(() => {
      expect(screen.getByText(/70/)).toBeInTheDocument();
    });

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
