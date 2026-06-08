import axios from 'axios';
import { API_CONFIG } from '../config/config'; 

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL 
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('--- Erro capturado no Axios Interceptor ---', error.message);
        return Promise.reject(error);
    }
);

export default api;