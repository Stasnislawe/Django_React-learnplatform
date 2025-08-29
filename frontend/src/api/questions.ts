import { API_URL } from '../config';
import { authService } from '../services/auth';
import type { Question } from '../types';
import { RANDOM_LIMIT } from '../config';

function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function fetchQuestions(courseId: number, practiceId: number): Promise<Question[]> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/${practiceId}/question`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить вопросы');
        }

        const questions = await response.json();
        return getRandomItems(questions, RANDOM_LIMIT);
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

export async function fetchQuestionDetails(courseId: number, practiceId: number, questionId: number): Promise<Question> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/${practiceId}/question/${questionId}`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить детали вопроса');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching question details:', error);
        throw error;
    }
}
