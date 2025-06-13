import axios from 'axios';

const API_URL = '/api/books';

export const fetchBook = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const reserveBook = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/reserve`);
  return response.data;
};

export const fetchMyBooks = async () => {
  const response = await axios.get('/api/users/my-books');
  return response.data;
};

export const extendBorrow = async (bookId, days = 1) => {
  const response = await axios.post(`${API_URL}/${bookId}/extend`, { days });
  return response.data;
};
