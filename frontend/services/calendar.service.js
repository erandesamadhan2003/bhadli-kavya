import api from '../api/api';

const calendarService = {
    getCalendarMonth: async (year, month, calendar = 'gregorian') => {
        try {
            const response = await api.get('/api/calendar/month', {
                params: { year, month, calendar },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getMyCalendar: async () => {
        try {
            const response = await api.get('/api/calendar/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default calendarService;