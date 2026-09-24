import { apiClient } from './client';

export async function getMyTutorApplication() {
  try {
    return await apiClient('/tutor-applications/me');
  } catch (error) {
    if (error.status === 404 || error.status === 401) {
      return null;
    }
    console.warn('Error fetching tutor application:', error);
    return null;
  }
}

export async function saveTutorApplication(data) {
  return await apiClient('/tutor-applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitTutorApplication(id) {
  return await apiClient(`/tutor-applications/${id}/submit`, {
    method: 'POST',
  });
}

export async function uploadTutorFile(file, type = 'avatar') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/v1/uploads', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Không thể tải lên tệp tin');
  }

  return await response.json();
}

export async function getAdminTutorApplications(status = 'all') {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return await apiClient(`/admin/tutor-applications${query}`);
}

export async function approveTutorApplication(id) {
  return await apiClient(`/admin/tutor-applications/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectTutorApplication(id, reason) {
  return await apiClient(`/admin/tutor-applications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
