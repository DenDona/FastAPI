import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// === ROOMS ===
export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
};

// === BOOKINGS ===
export const bookingAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => {
    // Конвертируем даты в ISO с таймзоной, как требует бэкенд
    const payload = {
      ...data,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
    };
    return api.post('/bookings', payload);
  },
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;