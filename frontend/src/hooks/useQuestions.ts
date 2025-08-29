import { useState, useEffect } from 'react';
import { fetchQuestions, fetchQuestionDetails } from '../api/questions';
import type { Question } from '../types';

export function useQuestions(courseId: number, practiceId: number) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchQuestions(courseId, practiceId);
                setQuestions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
            } finally {
                setLoading(false);
            }
        };

        if (courseId && practiceId) {
            loadQuestions();
        }
    }, [courseId, practiceId]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchQuestions(courseId, practiceId);
            setQuestions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
        } finally {
            setLoading(false);
        }
    };

    return { questions, loading, error, refetch };
}

export function useQuestion(courseId: number, practiceId: number, questionId: number) {
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQuestion = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchQuestionDetails(courseId, practiceId, questionId);
                setQuestion(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки вопроса');
            } finally {
                setLoading(false);
            }
        };

        if (courseId && practiceId && questionId) {
            loadQuestion();
        }
    }, [courseId, practiceId, questionId]);

    return { question, loading, error };
}