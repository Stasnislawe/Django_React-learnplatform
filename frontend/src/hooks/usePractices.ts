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

        // Добавляем статус прохождения из localStorage
        const practicesWithStatus = data.map(practice => {
          const completedPractices = JSON.parse(localStorage.getItem('completedPractices') || '{}');
          const practiceProgress = JSON.parse(localStorage.getItem('practiceProgress') || '{}');
          const practiceKey = `course-${courseId}-practice-${practice.id}`;

          return {
            ...practice,
            is_completed: completedPractices[practiceKey] || false,
            completed_questions: practiceProgress[practiceKey]?.completed || 0,
            total_questions: practiceProgress[practiceKey]?.total || practice.question_count
          };
        });

        setPractices(practicesWithStatus);
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