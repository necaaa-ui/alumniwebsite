import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/users';

export const getAllUsers = () => axios.get(BASE_URL);

export const assignCompany = (userId, companyId) =>
  axios.post(`${BASE_URL}/assign`, { userId, companyId });

export const updateStatus = (userId, companyId, status) => axios.put(`${BASE_URL}/${userId}/status`, { userId,companyId,status });

export const getUserByEmail = (email) => axios.get(`${BASE_URL}/email/${email}`);
