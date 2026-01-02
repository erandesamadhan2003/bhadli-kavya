import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const authService = {
    signup: async (userData) => {
        try {
            // Remove photoURL for email signups
            const { photoURL, ...signupData } = userData;

            const response = await api.post('/users/signup', signupData);

            if (response.data.access_token) {
                await AsyncStorage.setItem('access_token', response.data.access_token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    login: async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });

            if (response.data.access_token) {
                await AsyncStorage.setItem('access_token', response.data.access_token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    googleLogin: async (token) => {
        try {
            const response = await api.post('/api/auth/google/callback', { token });

            if (response.data.access_token) {
                await AsyncStorage.setItem('access_token', response.data.access_token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/api/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated: async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            return !!token;
        } catch (error) {
            return false;
        }
    },
};

export default authService;