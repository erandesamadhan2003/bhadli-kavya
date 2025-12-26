import api from '../api';
import poemsService from './poems.service';

const seasonService = {
    getSeasonPoems: async (seasonName, limit = 5) => {
        try {
            return await poemsService.getPoemsBySeason(seasonName, limit);
        } catch (error) {
            throw error;
        }
    },

    getSeasonCounts: async () => {
        try {
            return await poemsService.getSeasonCounts();
        } catch (error) {
            throw error;
        }
    },

    getCurrentSeason: () => {
        const month = new Date().getMonth() + 1;

        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        if (month >= 9 && month <= 11) return 'autumn';
        return 'winter';
    },
};

export default seasonService;