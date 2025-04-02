import axios from 'axios';

const api = axios.create({
  baseURL: 'https://petfordeploy.onrender.com/api',
});

export default api;
