import axios from 'axios';

const apiServerUrl: string = import.meta.env.VITE_APP_API_SERVER_URL as string;
const api = axios.create({
  baseURL: apiServerUrl,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(message);
    return Promise.reject(error);
  },
);

export default api;
