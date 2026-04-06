import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout')
};

// Activity API
export const activityAPI = {
    log: (activityData) => api.post('/activity', activityData),
    getUserActivities: (userId, params) => api.get(`/activity/${userId}`, { params }),
    getStats: (userId, params) => api.get(`/activity/stats/${userId}`, { params })
};

// Behavior API
export const behaviorAPI = {
    calculate: (userId) => api.post(`/behavior/calculate/${userId}`),
    getData: (userId) => api.get(`/behavior/${userId}`),
    getLatest: (userId) => api.get(`/behavior/${userId}/latest`)
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getStudents: () => api.get('/dashboard/students'),
    getAlerts: (params) => api.get('/dashboard/alerts', { params }),
    getStudentStats: () => api.get('/dashboard/student-stats'),
    getChildStats: () => api.get('/dashboard/child-stats')
};

export default api;
