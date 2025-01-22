import { useState, useEffect } from 'react';
import type { Course } from '../types';
import { fetchCourses } from '../api/courses';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return { courses, loading, error };
}