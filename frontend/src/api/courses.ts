import { ENDPOINTS, getHeaders, API_BASE_URL } from './endpoints';
import type { Course } from '../types';
import { authService } from '../services/auth';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(ENDPOINTS.courses, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Не удалось получить курсы');
  }
  return response.json();
}

export async function fetchCourse(id: number): Promise<Course> {
  const response = await fetch(`${ENDPOINTS.courses}${id}/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Не удалось получить курс');
  }
  return response.json();
}

export async function fetchFreeCourses(): Promise<Course[]>{
  const response = await fetch(`${API_BASE_URL}/courses/True/`);
  if (!response.ok) {
    throw new Error('Не удалось получить бесплатные курсы');
  }
  return response.json();
}

export async function fetchFreeCourse(id: number): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses/True/${id}/`);
  if (!response.ok) {
    throw new Error('Не удалось получить бесплатный курс');
  }
  return response.json();
}