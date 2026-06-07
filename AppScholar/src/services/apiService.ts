import axios from 'axios';
import { API_CONFIG } from '../config/config'; 

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL
});

export default api;