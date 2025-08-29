import { useState, useEffect } from 'react';
import { Practice } from '../types';
import { API_URL } from '../config';
import { authService } from '../services/auth';

export const usePractices = (courseId: string | undefined) => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPractices = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        let url: string;

        if (authService.isAuthenticated()) {
          url = `${API_URL}/courses/False/${courseId}/practice/`;
        } else {
          url = `${API_URL}/courses/True/${courseId}/practice/`;
        }

        const response = await authService.authenticatedFetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch practices');
        }

        const data: Practice[] = await response.json();
        setPractices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, [courseId]);

  return { practices, loading, error };
};