import { apiClient } from './client';

export const createBooking = async (bookingData) => {
  return await apiClient('/bookings/', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

export const getMyBookings = async () => {
  return await apiClient('/bookings/my-bookings');
};

export const getTutorBookings = async () => {
  return await apiClient('/bookings/tutor-bookings');
};

export const updateBookingStatus = async (bookingId, status) => {
  return await apiClient(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};
