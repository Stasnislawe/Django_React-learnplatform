import { API_BASE_URL } from '../config';
import { authService } from './auth';

export class ApiService {
  static async getQuestions(courseId: number, practiceId: number): Promise<any> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/courses/${free}/${courseId}/practice/${practiceId}/question`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  }

  static async getAnswers(courseId: number, practiceId: number, questionId: number): Promise<any> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/courses/${free}/${courseId}/practice/${practiceId}/question/${questionId}/answers`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch answers');
    }

    return response.json();
  }

  static async getPractices(courseId: number): Promise<any> {
    const free = !authService.isAuthenticated() ? 'True' : 'False';
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/courses/${free}/${courseId}/practice/`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch practices');
    }

    return response.json();
  }
}