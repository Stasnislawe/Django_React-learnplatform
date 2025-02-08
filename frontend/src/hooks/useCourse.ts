import { useState, useEffect } from 'react';
import type { Course } from '../types';
import { fetchCourse } from '../api/courses';

export function useCourse(id: number) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchCourse(id);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  return { course, loading, error };
}