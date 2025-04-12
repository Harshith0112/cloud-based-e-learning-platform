import api from '../index';

export interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  joinDate: string;
}

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: Omit<User, 'id' | 'joinDate'>) => {
    const response = await api.post('/users', user);
    return response.data;
  },

  updateUser: async (id: string, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
}; 