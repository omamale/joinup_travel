import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  sendOTP: (phone: string) => api.post('/auth/phone/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post('/auth/phone/verify-otp', { phone, otp }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get('/auth/me'),
};

// Trip APIs
export const tripsApi = {
  getAll: (filters?: any) => api.get('/trips', { params: filters }),
  getOne: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.patch(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  join: (id: string, message?: string) => api.post(`/trips/${id}/join`, { message }),
  respondRequest: (tripId: string, memberId: string, status: string) =>
    api.patch(`/trips/${tripId}/members/${memberId}`, { status }),
  getMyTrips: () => api.get('/trips/my-trips'),
};

// User APIs
export const usersApi = {
  getMe: () => api.get('/users/me'),
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getTrustScore: () => api.get('/users/me/trust-score'),
  search: (q: string) => api.get('/users/search', { params: { q } }),
  updateFCMToken: (token: string) => api.patch('/users/me/fcm-token', { token }),
};

// Chat APIs
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getOrCreateDirect: (targetUserId: string) => api.post('/chat/conversations/direct', { targetUserId }),
  getMessages: (conversationId: string, page = 1) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params: { page } }),
  markRead: (conversationId: string) => api.post(`/chat/conversations/${conversationId}/read`),
};

// AI Planner APIs
export const aiPlannerApi = {
  generate: (data: any) => api.post('/ai-planner/generate', data),
  getMyPlans: () => api.get('/ai-planner/my-plans'),
};

// Safety APIs
export const safetyApi = {
  triggerSOS: (data: any) => api.post('/safety/sos', data),
  getEmergencyContacts: () => api.get('/safety/emergency-contacts'),
  addEmergencyContact: (data: any) => api.post('/safety/emergency-contacts', data),
  deleteEmergencyContact: (id: string) => api.delete(`/safety/emergency-contacts/${id}`),
  reportUser: (data: any) => api.post('/safety/report', data),
  blockUser: (userId: string) => api.post(`/safety/block/${userId}`),
  unblockUser: (userId: string) => api.delete(`/safety/block/${userId}`),
};

// Reviews APIs
export const reviewsApi = {
  create: (data: any) => api.post('/reviews', data),
  getForUser: (userId: string) => api.get(`/reviews/user/${userId}`),
  getForTrip: (tripId: string) => api.get(`/reviews/trip/${tripId}`),
};

// Upload APIs
export const uploadApi = {
  avatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  tripCover: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/trip-cover', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  chatImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/chat-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  idDocument: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/id-document', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// Notifications APIs
export const notificationsApi = {
  getAll: (page = 1) => api.get('/notifications', { params: { page } }),
  markAllRead: () => api.patch('/notifications/read-all'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
};
