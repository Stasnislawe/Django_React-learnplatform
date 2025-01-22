import { ENDPOINTS, getHeaders } from './endpoints';
import type { Theories } from '../types';

export async function fetchTheories(id: string): Promise<Theories[]> {
  const response = await fetch(`${ENDPOINTS.courses}${id}/theories/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Ошибка в подключении к апи джанго - список теории');
  }
  return response.json();
}

export async function fetchTheoriesDetails(id: string, theoriesId: string): Promise<{
}> {
  const response = await fetch(`${ENDPOINTS.courses}${id}/theories/${theoriesId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch theoriesId');
  }
  return response.json();
}