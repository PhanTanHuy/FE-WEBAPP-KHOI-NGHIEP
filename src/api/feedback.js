import { apiClient } from './client';

export async function createFeedback(feedbackData) {
  return apiClient('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });
}

export async function getFeedbackList(skip = 0, limit = 100) {
  return apiClient(`/admin/feedback?skip=${skip}&limit=${limit}`);
}

export async function getFeedbackDetail(feedbackId) {
  return apiClient(`/admin/feedback/${feedbackId}`);
}