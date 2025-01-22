import { ENDPOINTS, getHeaders } from './endpoints';
import type { Course } from '../types';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(ENDPOINTS.courses);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function fetchCourse(id: number): Promise<Course> {
  const response = await fetch(`${ENDPOINTS.courses}${id}/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}