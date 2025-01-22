import { useState, useEffect } from 'react';
import type { Practice } from '../types';
import { fetchPractices } from '../api/practice';

export function usePractices(courseId: number) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPractices() {
      try {
        const data = await fetchPractices(courseId);
        setPractices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load practices');
      } finally {
        setLoading(false);
      }
    }

    loadPractices();
  }, [courseId]);

  return { practices, loading, error };
}