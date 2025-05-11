// Base API URL - should come from environment variables
export const API_BASE_URL = 'http://127.0.0.1:8000';
import { authService } from '../services/auth';

export const ENDPOINTS = {
  courses: `${API_BASE_URL}/courses/False/`,
  questions: (courseId: number, practiceId: number) => `${API_BASE_URL}/courses/False/${courseId}/practice/${practiceId}/question`,
  answers: (courseId: number, practiceId: number, questionId: number) =>
    `${API_BASE_URL}/courses/False/${courseId}/practice/${practiceId}/question/${questionId}/answers`,
} as const;

export const getHeaders = () => {
    const token = authService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`} : {}),
    };
};