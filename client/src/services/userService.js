import axios from 'axios';

const API_URL = '/api/users';

export const fetchProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(`${API_URL}/profile`, data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axios.put(`${API_URL}/change-password`, data);
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await axios.post(`${API_URL}/delete-account`, { password });
  return response.data;
};
