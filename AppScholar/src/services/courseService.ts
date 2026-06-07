import api from './apiService';

class CourseService {
    async getCourses() {
        try {
            const response = await api.get('/courses'); 
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar cursos:', error);
            throw error;
        }
    }
}

export const courseService = new CourseService();