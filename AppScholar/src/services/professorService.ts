import api from './apiService';

class ProfessorService {
    async getProfessors() {
        try {
            const response = await api.get('/professors');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching professors:', error);
            throw error;
        }
    }

    async createProfessor(professorData: any) {
        try {
            const response = await api.post('/professors', professorData);
            return response.data;
        }
        catch (error) {
            console.error('Error creating professor:', error);
            throw error;
        }
    }

    async getSubjectsByProfessor(userId: number) {
        try {
            console.log('Fetching subjects for professor with userId:', userId);
            const response = await api.get(`/professors/${userId}/subjects`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching subjects for professor:', error);
            throw error;
        }
    }

    async updateProfessor(id: number, professorData: any) {
        try {
            const response = await api.put(`/professors/${id}`, professorData);
            return response.data;
        }
        catch (error) {
            console.error('Error updating professor:', error);
            throw error;
        }
    }

    async deleteProfessor(id: number) {
        try {
            const response = await api.delete(`/professors/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error deleting professor:', error);
            throw error;
        }
    }
}

export const professorService = new ProfessorService();