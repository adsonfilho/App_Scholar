import api from './apiService';

class SubjectService {
  async getSubjectsByCourse(courseId: number) {
    const response = await api.get(`/courses/${courseId}/subjects`);
    return response.data;
  }

  async createSubject(subjectData: { name: string; workload: number; courseId: number }) {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  }
}

export const subjectService = new SubjectService();