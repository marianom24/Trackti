import api from "./api";
import axios from "axios";

export const TokenManager = {
    getAccessToken: () => localStorage.getItem('access_token'),
    getRefreshToken: () => localStorage.getItem('refresh_token'),
    getUsername: ()=> localStorage.getItem('username'),
    saveAccessToken: (access) => {
        localStorage.setItem('access_token', access);
    },
    saveRefreshToken: (refresh) => {
        localStorage.setItem('refresh_token', refresh);
    },
    saveTokens: ({ access, refresh }) => {
        TokenManager.saveAccessToken(access);
        TokenManager.saveRefreshToken(refresh);
    },
    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username')
    },
    retrieveSaveUsername: async () =>{
        const response = await api.get('/auth/users/me/');
        localStorage.setItem('username', response.data.username);
    },
    logout: async () => {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
            try {
                await api.post('/logout/', { refresh: refreshToken });
                localStorage.clear()
                window.location.href = '/login'; // Redirigir al usuario a la página de login
            } catch (error) {
                console.error('Error during logout', error);
            }
        }
    }
};