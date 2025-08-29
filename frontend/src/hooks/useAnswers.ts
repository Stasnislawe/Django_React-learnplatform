import { useState, useEffect } from 'react';
import { fetchAnswers } from '../api/answers';
import type { Answer } from '../types';

export function useAnswers(courseId: number, practiceId: number, questionId: number) {
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAnswers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAnswers(courseId, practiceId, questionId);
                setAnswers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки ответов');
            } finally {
                setLoading(false);
            }
        };

        if (courseId && practiceId && questionId) {
            loadAnswers();
        }
    }, [courseId, practiceId, questionId]);

    return { answers, loading, error };
}