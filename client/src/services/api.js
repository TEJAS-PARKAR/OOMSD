import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('railway_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to catch headers (e.g. X-Handled-By)
api.interceptors.response.use(
  (response) => {
    if (response.headers['x-handled-by']) {
      localStorage.setItem('last_replica', response.headers['x-handled-by']);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const stationService = {
  getAll: () => api.get('/stations'),
  getByCode: (code) => api.get(`/stations/${code}`),
};

export const scheduleService = {
  search: (source, destination, date) =>
    api.get('/schedules/search', { params: { source, destination, date } }),
  getAll: () => api.get('/schedules'),
};

export const trainService = {
  getAll: () => api.get('/trains'),
  getCoaches: (trainNumber) => api.get(`/trains/${trainNumber}/coaches`),
  getCacheDiagnostics: () => api.get('/trains/diagnostics/cache'),
};

export const seatService = {
  getByCoach: (coachId) => api.get(`/seats/coaches/${coachId}`),
  lockSeat: (seatId, userId) => api.post('/seats/lock', { seatId, userId }),
  unlockSeat: (seatId, userId) => api.post('/seats/unlock', { seatId, userId }),
};

export const reservationService = {
  bookTicket: (data) => api.post('/reservations', data),
  checkPNR: (pnr) => api.get(`/reservations/${pnr}`),
  cancelTicket: (pnr) => api.post(`/reservations/${pnr}/cancel`),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const adminService = {
  addTrain: (data) => api.post('/admin/trains', data),
  addStation: (data) => api.post('/admin/stations', data),
  addSchedule: (data) => api.post('/admin/schedules', data),
  addCoach: (data) => api.post('/admin/coaches', data),
};

export default api;
