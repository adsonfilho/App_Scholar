import api from './apiService';

class InvitationService {
    async getInvitations() {
        try {
            const response = await api.get('/invitations');
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar convites:', error);
            throw error;
        }
    }

    async createInvitation(invitationData: { email: string; role: 'STUDENT' | 'PROFESSOR'; enrollment: string; courseId?: number | null }) {
        try {

            console.log('Dados do convite a serem enviados:', invitationData); 
            const response = await api.post('/invitations', invitationData);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao criar convite:', error);
            throw error;
        }
    }

    async deleteInvitation(id: number) {
        try {
            await api.delete(`/invitations/${id}`);
        } 
        catch (error) {
            console.error(`Erro ao deletar convite com ID ${id}:`, error);
            throw error;
        }
    }

    generateRegistrationNumber(): string {
        const currentYear = new Date().getFullYear();
        const randomDigits = Math.floor(10000 + Math.random() * 90000); 
        return `${currentYear}${randomDigits}`;
    }
}

export const invitationService = new InvitationService();