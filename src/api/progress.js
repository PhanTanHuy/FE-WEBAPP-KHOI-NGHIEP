import { apiClient } from './client';

export async function getProgressSummary() {
  return apiClient('/progress/');
}

export async function getBookingSessions(bookingId) {
  return apiClient(`/progress/bookings/${bookingId}/sessions`);
}

export async function createBookingSession(bookingId, sessionData) {
  return apiClient(`/progress/bookings/${bookingId}/sessions`, {
    method: 'POST',
    body: JSON.stringify(sessionData),
  });
}

export async function addProgressReport(sessionId, reportData) {
  return apiClient(`/progress/sessions/${sessionId}/report`, {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}
