import { apiClient } from './client';

export async function getSubjects() {
  return apiClient('/api/v1/subjects');
}

export async function getLevels() {
  return apiClient('/api/v1/levels');
}

export async function getLocations() {
  return apiClient('/api/v1/locations');
}
