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

    async createCourse(courseData: any) {
        try {
            const response = await api.post('/courses', courseData); 
            return response.data;
        }
        catch (error) {
            console.error('Erro ao criar curso:', error);
            throw error;
        }
    }

    async updateCourse(courseId: number, courseData: any) {
        try {
            const response = await api.put(`/courses/${courseId}`, courseData); 
            return response.data;
        }
        catch (error) {
            console.error('Erro ao atualizar curso:', error);
            throw error;
        }
    }

    async deleteCourse(courseId: number) {
        try {
            await api.delete(`/courses/${courseId}`); 
        }
        catch (error) {
            console.error('Erro ao deletar curso:', error);
            throw error;
        }
    }
}

export const courseService = new CourseService();