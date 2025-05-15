import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // Add timeout to avoid hanging requests
  timeout: 10000,
});

// Add request interceptor to add auth token
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle server connection errors
    if (!error.response) {
      console.error('Server connection error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string, role: string) => {
    try {
      const response = await api.post('/auth/login', { username, password, role });
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', error);
      throw error;
    }
  },
  register: async (username: string, password: string, role: string, name: string) => {
    const response = await api.post('/auth/register', { username, password, role, name });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
};

// Student services
export const studentService = {
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/students/profile', profileData);
    return response.data;
  },
  getInterviews: async () => {
    const response = await api.get('/students/interviews');
    return response.data;
  },
  getApplications: async () => {
    const response = await api.get('/students/applications');
    return response.data;
  },
  getDocuments: async () => {
    const response = await api.get('/students/documents');
    return response.data;
  }
};

// Employer services
export const employerService = {
  getJobs: async () => {
    const response = await api.get('/employers/jobs');
    return response.data;
  }
};

// Placement services
export const placementService = {
  getDrives: async () => {
    const response = await api.get('/placements/drives');
    return response.data;
  },
  addDrive: async (driveData: any) => {
    const response = await api.post('/placements/drives', driveData);
    return response.data;
  },
  getCompanies: async () => {
    const response = await api.get('/placements/companies');
    return response.data;
  },
  addCompany: async (companyData: any) => {
    const response = await api.post('/placements/companies', companyData);
    return response.data;
  },
  getDepartmentChartData: async () => {
    const response = await api.get('/placements/charts/department');
    return response.data;
  },
  downloadChart: async (chartType: string, format: string = 'pdf') => {
    // Mock implementation for demo/testing purposes
    return {
      success: true,
      message: `Chart ${chartType} downloaded as ${format}`,
      url: `data:application/pdf;base64,MOCK_BASE64_PDF_DATA==`,
    };
  }
};

export default api;
