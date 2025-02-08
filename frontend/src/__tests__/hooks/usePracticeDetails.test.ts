import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePracticeDetails } from '../../hooks/usePracticeDetails';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('usePracticeDetails', () => {
  it('fetches practice details successfully', async () => {
    const mockData = {
      questions: [
        { id: 1, question: "Test Question", answer: "Test Answer", just_resp: "Explanation" }
      ],
      answers: [
        { id: 1, question_str: "Test Answer", question: 1 }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => usePracticeDetails(1, 1));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions).toEqual(mockData.questions);
    expect(result.current.answers).toEqual(mockData.answers);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePracticeDetails(1, 1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load practice details');
    expect(result.current.questions).toEqual([]);
    expect(result.current.answers).toEqual([]);
  });
});