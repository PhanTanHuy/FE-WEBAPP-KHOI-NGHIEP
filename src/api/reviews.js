import { apiClient } from './client';

export async function createReview(data) {
  return apiClient('/reviews/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTutorReviews(tutorId) {
  return apiClient(`/reviews/tutor/${tutorId}`);
}

export async function getMyReviews() {
  return apiClient('/reviews/my');
}

export async function checkBookingReview(bookingId) {
  return apiClient(`/reviews/check-booking/${bookingId}`);
}
