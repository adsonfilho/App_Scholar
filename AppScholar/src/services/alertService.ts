import api from './apiService';

class AlertService {
    async getAlerts() {
        try {
            const response = await api.get('/alert');
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar alertas:', error);
            throw error;
        }
    }

    async createAlert(alertData: any) {
        try {
            const response = await api.post('/alert', alertData);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao criar alerta:', error);
            throw error;
        }
    }
}

export const alertService = new AlertService();