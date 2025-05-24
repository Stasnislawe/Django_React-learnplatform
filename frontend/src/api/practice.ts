import { ENDPOINTS, getHeaders } from './endpoints';
import type { Practice, Question, Answer } from '../types';
import { RANDOM_LIMIT } from '../config';

function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function fetchPractices(courseId: number): Promise<Practice[]> {
  const response = await fetch(`${ENDPOINTS.courses}${courseId}/practice/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Не удалось получить практику');
  }
  const practices = await response.json();
  return getRandomItems(practices, RANDOM_LIMIT);
}

export async function fetchPracticeDetails(courseId: number, practiceId: number): Promise<{
  questions: Question[];
  answers: Answer[];
}> {
  const response = await fetch(`${ENDPOINTS.courses}${courseId}/practice/${practiceId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Не удалось получить детали практики');
  }
  return response.json();
}