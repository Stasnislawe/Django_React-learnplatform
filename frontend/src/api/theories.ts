import { API_URL } from '../config';
import { authService } from '../services/auth';
import type { Theories } from '../types';

export async function fetchTheories(id: string): Promise<Theories[]> {
  const free = !authService.isAuthenticated() ? 'True' : 'False';

  try {
    const response = await authService.authenticatedFetch(
      `${API_URL}/courses/${free}/${id}/theories/`
    );
    if (!response.ok) {
      throw new Error('Ошибка в подключении к апи джанго - список теории');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching theories:', error);
    throw error;
  }
}

export async function fetchTheoriesDetails(id: string, theoriesId: string): Promise<{
}> {
  const free = !authService.isAuthenticated() ? 'True' : 'False';

  try {
    const response = await authService.authenticatedFetch(
      `${API_URL}/courses/${free}/${id}/theories/${theoriesId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch theoriesId');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching theory details:', error);
    throw error;
  }
}