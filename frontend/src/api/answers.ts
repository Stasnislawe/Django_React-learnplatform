import { API_URL } from '../config';
import { authService } from '../services/auth';
import type { Answer } from '../types';

export async function fetchAnswers(courseId: number, practiceId: number, questionId: number): Promise<Answer[]> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/${practiceId}/question/${questionId}/answers`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить ответы');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching answers:', error);
        throw error;
    }
}

export async function fetchAnswerDetails(courseId: number, practiceId: number, questionId: number, answerId: number): Promise<Answer> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/${practiceId}/question/${questionId}/answers/${answerId}`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить детали ответа');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching answer details:', error);
        throw error;
    }
}