import api from '../api/api';

const chatService = {
    sendMessage: async (message, sessionId = null) => {
        try {
            const response = await api.post('/api/chat/send', {
                message,
                session_id: sessionId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getChatHistory: async (limit = 10, before = null) => {
        try {
            const params = { limit };
            if (before) params.before = before;

            const response = await api.get('/api/chat/history', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const response = await api.delete(`/api/chat/message/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default chatService;