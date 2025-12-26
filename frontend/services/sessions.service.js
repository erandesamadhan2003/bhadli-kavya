import api from '../api/api';

const sessionsService = {
    createSession: async (title = 'Untitled Session') => {
        try {
            const response = await api.post('/api/sessions/create', { title });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSessions: async () => {
        try {
            const response = await api.get('/api/sessions/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    endSession: async (sessionId) => {
        try {
            const response = await api.put(`/api/sessions/${sessionId}/end`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSession: async (sessionId) => {
        try {
            const response = await api.get(`/api/sessions/${sessionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default sessionsService;
