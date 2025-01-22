import { useState, useEffect } from 'react';
import type { Question, Answer } from '../types';
import { ENDPOINTS } from '../api/endpoints';

export function usePracticeDetails(courseId: number, practiceId: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPracticeDetails() {
      try {
        // Fetch questions
        const questionsResponse = await fetch(ENDPOINTS.questions(courseId, practiceId));
        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Fetch answers for each question
        const allAnswers: Answer[] = [];
        for (const question of questionsData) {
          const answersResponse = await fetch(
            ENDPOINTS.answers(courseId, practiceId, question.id)
          );
          if (!answersResponse.ok) {
            throw new Error(`Failed to fetch answers for question ${question.id}`);
          }
          const questionAnswers = await answersResponse.json();
          allAnswers.push(...questionAnswers);
        }
        setAnswers(allAnswers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load practice details');
      } finally {
        setLoading(false);
      }
    }

    loadPracticeDetails();
  }, [courseId, practiceId]);

  return { questions, answers, loading, error };
}