import { useState, useEffect } from 'react';
import type { Theories } from '../types';
import { useNavigate } from 'react-router-dom';
import { fetchTheoriesDetails } from '../api/theories';

export function useTheory(id: string, theoryId: string) {
  const [theory, setTheory] = useState<Theories | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTheory() {
      try {
        if (id && theoryId) {
          const data = await fetchTheoriesDetails(id, theoryId);
          setTheory(data);

          const readParts = JSON.parse(localStorage.getItem(`course-${id}-read-theories`) || '[]');
            if (!readParts.includes(theoryId)) {
              readParts.push(theoryId);
              localStorage.setItem(`course-${id}-read-theories`, JSON.stringify(readParts));
            }
//           const readTheories = JSON.parse(localStorage.getItem(`course-${courseId}-read-theories`) || '[]');
//
//           if (!readTheories.includes(theoryId)) {
//             readTheories.push(theoryId);
//             localStorage.setItem(`course-${courseId}-read-theories`, JSON.stringify(readTheories));
//           }
        }
      } catch (err) {
//         setError(err instanceof Error ? err.message : error);
//         console.error('Failed to fetch book part:', error)
        navigate(`/course/${id}/practices`)
      } finally {
        setLoading(false);
      }
    }

    loadTheory();
  }, [id, theoryId]);

  return { theory, loading, error };
}