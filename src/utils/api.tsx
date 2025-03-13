import axios, { InternalAxiosRequestConfig } from 'axios';
import i18n from 'i18next';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_SERVER_URL}`,
});

// Add request interceptor for Accept-Language header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const currentLang = i18n.language;
  // Set Accept-Language with quality values for fallbacks
  config.headers['Accept-Language'] =
    `${currentLang},${currentLang}-${currentLang.toUpperCase()};q=0.9,en;q=0.8`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.output) {
      return response.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
