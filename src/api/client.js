const API_PREFIX = '/api/v1';
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getAuthToken = () => (
  localStorage.getItem('token') || sessionStorage.getItem('token')
);

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export async function apiClient(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/api')
    ? endpoint
    : `${API_PREFIX}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;
  const token = getAuthToken();
  const headers = {
    ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = Array.isArray(errorData.detail)
        ? errorData.detail.map((item) => item.msg).join(' ')
        : errorData.detail;
      const error = new Error(detail || `Yêu cầu thất bại (${response.status}).`);
      error.status = response.status;
      if (response.status === 401 && token) {
        clearAuthToken();
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw error;
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
    throw error;
  }
}
