import api from './apiService';

class GradeService {

    async createGrade(gradeData: any) {
        try {
            const response = await api.post('/grades', gradeData);
            return response.data;
        } catch (error) {
            console.error("Error creating grade:", error);
            throw error;
        }
    }

    async updateGrade(gradeId: number, gradeData: any) {
        try {
            const response = await api.put(`/grades/${gradeId}`, gradeData);
            return response.data;
        } catch (error) {
            console.error("Error updating grade:", error);
            throw error;
        }
    }
}

export const gradeService = new GradeService();