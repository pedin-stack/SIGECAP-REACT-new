import api from './axiosConfig';

const BASE = '/auth';

const AuthService = {
  login: async (email, password) => {
    const response = await api.post(`${BASE}/login`, { email, password });
    return response.data;
  },

  setSession: (token, user) => {
    try {
      if (token) localStorage.setItem('authToken', token);
      if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    } catch (e) {
      // ignore
    }
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};

export default AuthService;
