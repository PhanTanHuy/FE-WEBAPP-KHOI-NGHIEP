const API_PREFIX = '/api/v1';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://educonnect-backend-p3mf.onrender.com';

export async function apiClient(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/api')
    ? endpoint
    : `${API_PREFIX}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;
  
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Lỗi yêu cầu: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}
