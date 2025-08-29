import { useState, useEffect } from 'react';
import type { Question, Answer } from '../types';
import { authService } from '../services/auth';

export function usePractice(courseId: number, practiceId: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPractice() {
      try {
        const free = !authService.isAuthenticated() ? 'True' : 'False';

        // Fetch questions
        const questionsResponse = await authService.authenticatedFetch(
          `http://127.0.0.1:8000/courses/${free}/${courseId}/practice/${practiceId}/question`
        );

        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }

        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Fetch answers for all questions
        const answersPromises = questionsData.map(async (q: Question) => {
          const response = await authService.authenticatedFetch(
            `http://127.0.0.1:8000/courses/${free}/${courseId}/practice/${practiceId}/question/${q.id}/answers`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch answers for question ${q.id}`);
          }

          return response.json();
        });

        const answersData = await Promise.all(answersPromises);
        setAnswers(answersData.flat());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load practice');
      } finally {
        setLoading(false);
      }
    }

    if (courseId && practiceId) {
      loadPractice();
    }
  }, [courseId, practiceId]);

  return { questions, answers, loading, error };
}