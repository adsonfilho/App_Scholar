import api from './apiService';


class StudentService {
    async getStudents() {
        try {
            const response = await api.get('/students');
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar estudantes:', error);
            throw error;
        }
    }

    async getStudentById(id: number) {
        try {
            const response = await api.get(`/students/${id}`);
            return response.data;
        }
        catch (error) {
            console.error(`Erro ao buscar estudante com ID ${id}:`, error);
            throw error;
        }
    }

    async createStudent(studentData: any) {
        try {
            const response = await api.post('/students', studentData);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao criar estudante:', error);
            throw error;
        }
    }

    async updateStudent(id: number, studentData: any) {
        try {
            const response = await api.put(`/students/${id}`, studentData);
            return response.data;
        }
        catch (error) {
            console.error(`Erro ao atualizar estudante com ID ${id}:`, error);
            throw error;
        }
    }

    async deleteStudent(id: number) {
        try {
            await api.delete(`/students/${id}`);
        }   
        catch (error) {
            console.error(`Erro ao deletar estudante com ID ${id}:`, error);
            throw error;
        }
    }
}

export const studentService = new StudentService();
