import { apiClient } from './client';

export async function getMaterials(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.subject && params.subject !== 'all') query.append('subject', params.subject);
  if (params.level && params.level !== 'all') query.append('level', params.level);
  if (params.grade && params.grade !== 'all') query.append('grade', params.grade);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.file_format && params.file_format !== 'all') query.append('file_format', params.file_format);
  if (params.price && params.price !== 'all') query.append('price', params.price);
  if (params.sort) query.append('sort', params.sort);
  if (params.page != null) query.append('page', params.page);
  if (params.per_page != null) query.append('per_page', params.per_page);

  const queryString = query.toString();
  return apiClient(`/materials/${queryString ? `?${queryString}` : ''}`);
}

export async function getMaterialById(id) {
  return apiClient(`/materials/${id}`);
}

export async function getMyFavorites() {
  return apiClient('/materials/my-favorites');
}

export async function toggleFavorite(id) {
  return apiClient(`/materials/${id}/favorite`, {
    method: 'POST',
  });
}

export async function downloadMaterial(id) {
  return apiClient(`/materials/${id}/download`, {
    method: 'POST',
  });
}

export async function createMaterial(data) {
  return apiClient('/materials/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadMaterialFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const res = await fetch('http://127.0.0.1:8000/api/v1/materials/upload-file', {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Không thể tải file lên');
  }

  return res.json();
}
