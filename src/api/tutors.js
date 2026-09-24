import { apiClient } from './client';

export async function getTutors(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.subject && params.subject !== 'all') query.append('subject', params.subject);
  if (params.level && params.level !== 'all') query.append('level', params.level);
  if (params.city && params.city !== 'all') query.append('city', params.city);
  if (params.district && params.district !== 'all') query.append('district', params.district);
  if (params.mode && params.mode !== 'all') query.append('mode', params.mode);
  if (params.min_price != null) query.append('min_price', params.min_price);
  if (params.max_price != null) query.append('max_price', params.max_price);
  if (params.verified != null) query.append('verified', params.verified);
  if (params.sort) query.append('sort', params.sort);
  if (params.page != null) query.append('page', params.page);
  if (params.per_page != null) query.append('per_page', params.per_page);
  if (params.paginate != null) query.append('paginate', params.paginate);

  const queryString = query.toString();
  const endpoint = `/tutors${queryString ? `?${queryString}` : ''}`;
  return apiClient(endpoint);
}

export async function getTutorById(id) {
  return apiClient(`/tutors/${id}`);
}

export async function getTutorAvailability(id) {
  return apiClient(`/tutors/${id}/availability`);
}

export async function updateMyAvailability(schedule) {
  return apiClient('/tutors/me/availability', {
    method: 'PUT',
    body: JSON.stringify({ schedule }),
  });
}
