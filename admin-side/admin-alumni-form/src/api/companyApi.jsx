import axios from 'axios';

const BASE_URL = 'https://alumni-job-form.onrender.com/api/companies';

export const getCompanies = (skill) =>
  axios.get(skill ? `${BASE_URL}?skill=${skill}` : BASE_URL);

export const addCompany = (data) => axios.post(BASE_URL, data);

export const updateCompany = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);

export const deleteCompany = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

export const getCompanyById = (id) => axios.get(`${BASE_URL}/${id}`);
