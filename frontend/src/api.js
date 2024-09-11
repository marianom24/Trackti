import axios from 'axios';
import { TokenManager } from './TokenManager';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const authToken = TokenManager.getAccessToken();
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response){
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refresh_token = TokenManager.getRefreshToken();
                if (refresh_token) {
                    try {
                        const { data } = await api.post('/api/token/refresh/', { refresh: refresh_token });
                        TokenManager.saveTokens(data);
                        api.defaults.headers.common['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
                        return axios(originalRequest);
                    } catch (err) {
                        TokenManager.clearTokens();
                        window.location.href = '/login';
                    }
                }
            }
            return Promise.reject(error);
        }
    }
);

export default api;