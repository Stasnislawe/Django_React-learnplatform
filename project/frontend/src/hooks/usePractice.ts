import { useState, useEffect } from 'react';
import type { Question, Answer } from '../types';
import { fetchQuestions, fetchAnswers } from '../api/theories';

export function usePractice(courseId: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPractice() {
      try {
        const questionData = await fetchQuestions(courseId);
        setQuestions(questionData);

        // Fetch answers for all questions
        const answersPromises = questionData.map(q => fetchAnswers(q.id));
        const answersData = await Promise.all(answersPromises);
        setAnswers(answersData.flat());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load practice');
      } finally {
        setLoading(false);
      }
    }

    loadPractice();
  }, [courseId]);

  return { questions, answers, loading, error };
}