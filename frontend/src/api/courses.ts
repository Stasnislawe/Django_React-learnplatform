import { API_URL } from '../config';
import { authService } from '../services/auth';
import type { Course } from '../types';

export async function fetchCourses(): Promise<Course[]> {
  if (!authService.isAuthenticated()) {
    // For unauthenticated users, fetch only free courses
    try {
      const response = await fetch(`${API_URL}/courses/True/`);
      if (!response.ok) {
        throw new Error('Не удалось получить бесплатные курсы');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching free courses:', error);
      throw error;
    }
  }

  try {
    const response = await authService.authenticatedFetch(`${API_URL}/courses/False/`);
    if (!response.ok) {
      throw new Error('Не удалось получить курсы');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function fetchCourse(id: number): Promise<Course> {
  if (!authService.isAuthenticated()) {
    // For unauthenticated users, fetch only free courses
    try {
      const response = await fetch(`${API_URL}/courses/True/${id}/`);
      if (!response.ok) {
        throw new Error('Не удалось получить бесплатный курс');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching free course:', error);
      throw error;
    }
  }

  try {
    const response = await authService.authenticatedFetch(`${API_URL}/courses/False/${id}/`);
    if (!response.ok) {
      throw new Error('Не удалось получить курс');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

export async function fetchFreeCourses(): Promise<Course[]>{
  try {
    const response = await fetch(`${API_URL}/courses/True/`);
    if (!response.ok) {
      throw new Error('Не удалось получить бесплатные курсы');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching free courses:', error);
    throw error;
  }
}

export async function fetchFreeCourse(id: number): Promise<Course> {
  try {
    const response = await fetch(`${API_URL}/courses/True/${id}/`);
    if (!response.ok) {
      throw new Error('Не удалось получить бесплатный курс');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching free course:', error);
    throw error;
  }
}