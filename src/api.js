import axios from 'axios';

const api = axios.create({
  baseURL: 'https://petfordeploy.onrender.com',
});

export default api;
