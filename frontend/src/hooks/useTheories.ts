import { useState, useEffect } from 'react';
import type { Theories } from '../types';
import { fetchTheories } from '../api/theories';

export function useTheories(id: string) {
  const [theories, setTheories] = useState<Theories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readParts, setReadParts] = useState<string[]>([]);
//   const [readTheories, setReadTheories] = useState<string[]>([]);

  useEffect(() => {
    async function loadTheories() {
      try {
        if (id) {
          const data = await fetchTheories(id);
          setTheories(data);
          const storedReadParts = JSON.parse(localStorage.getItem(`course-${id}-read-theories`) || '[]');
          setReadParts(storedReadParts);
//           const storedReadTheories = JSON.parse(localStorage.getItem(`course-${courseId}-read-theories`) || '[]');
//           setReadTheories(storedReadTheories);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load theories');
      } finally {
        setLoading(false);
      }
    }

    loadTheories();
  }, [id]);

  return { theories, loading, error, readParts };
}