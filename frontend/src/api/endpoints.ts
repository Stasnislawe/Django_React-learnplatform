export const API_BASE_URL = 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  courses: (free: string) => `${API_BASE_URL}/courses/${free}/`,
  practices: (free: string, courseId: number) => `${API_BASE_URL}/courses/${free}/${courseId}/practice/`,
  questions: (free: string, courseId: number, practiceId: number) =>
    `${API_BASE_URL}/courses/${free}/${courseId}/practice/${practiceId}/question`,
  answers: (free: string, courseId: number, practiceId: number, questionId: number) =>
    `${API_BASE_URL}/courses/${free}/${courseId}/practice/${practiceId}/question/${questionId}/answers`,
} as const;