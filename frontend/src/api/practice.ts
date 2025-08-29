import { API_URL } from '../config';
import { authService } from '../services/auth';
import type { Practice, Question, Answer } from '../types';
import { RANDOM_LIMIT } from '../config';

function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function fetchPractices(courseId: number): Promise<Practice[]> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить практику');
        }

        const practices = await response.json();
        return getRandomItems(practices, RANDOM_LIMIT);
    } catch (error) {
        console.error('Error fetching practices:', error);
        throw error;
    }
}

export async function fetchPracticeDetails(courseId: number, practiceId: number): Promise<{
    questions: Question[];
    answers: Answer[];
}> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';

    try {
        const response = await authService.authenticatedFetch(
            `${API_URL}/courses/${free}/${courseId}/practice/${practiceId}`
        );

        if (!response.ok) {
            throw new Error('Не удалось получить детали практики');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching practice details:', error);
        throw error;
    }
}