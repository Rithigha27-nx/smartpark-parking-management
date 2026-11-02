import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const apiService = {
  // Vehicle Operations
  entryVehicle: (data) => apiClient.post('/vehicles/entry', data),
  exitVehicle: (data) => apiClient.post('/vehicles/exit', data),
  getVehicleByPlate: (plate) => apiClient.get(`/vehicles/${encodeURIComponent(plate)}`),

  // Parking State
  getSlots: () => apiClient.get('/parking/slots'),
  getQueue: () => apiClient.get('/parking/queue'),
  getStatistics: () => apiClient.get('/parking/statistics'),

  // Records & Reports
  getTransactions: (params) => apiClient.get('/transactions', { params }),
  getReports: (params) => apiClient.get('/reports', { params }),

  // Health check to auto-detect backend availability
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health', { timeout: 1500 });
      return res.status === 200;
    } catch {
      return false;
    }
  },
};

export default apiClient;
