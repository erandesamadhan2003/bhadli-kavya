import api from '../api/api';

const poemsService = {
    createPoem: async (poem, language, season, location) => {
        try {
            const response = await api.post('/api/poems/create', {
                poem,
                language,
                season,
                location,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPoems: async (filters = {}) => {
        try {
            const response = await api.get('/api/poems/', {
                params: filters, // { language, season, location }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPoem: async (poemId) => {
        try {
            const response = await api.get(`/api/poems/${poemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deletePoem: async (poemId) => {
        try {
            const response = await api.delete(`/api/poems/${poemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPoemsByLanguage: async (language, limit = 5, before = null) => {
        try {
            const params = { limit };
            if (before) params.before = before;

            const response = await api.get(`/api/poems/language/${language}`, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPoemsBySeason: async (season, limit = 5) => {
        try {
            const response = await api.get(`/api/poems/season/${season}`, {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPoemsByLocation: async (location, limit = 5) => {
        try {
            const response = await api.get(`/api/poems/location/${location}`, {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSeasonCounts: async () => {
        try {
            const response = await api.get('/api/poems/season-counts');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    uploadPoemsCSV: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/api/poems/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default poemsService;
