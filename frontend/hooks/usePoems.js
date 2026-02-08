import { useState, useCallback } from 'react';
import { poemsService } from '../services';

export const usePoems = () => {
    const [poems, setPoems] = useState([]);
    const [poem, setPoem] = useState(null);
    const [seasonCounts, setSeasonCounts] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPoem = useCallback(async (poemData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.createPoem(
                poemData.poem,
                poemData.language,
                poemData.season,
                poemData.location
            );
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPoems = useCallback(async (filters = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getPoems(filters);
            setPoems(response.poems || []);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPoem = useCallback(async (poemId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getPoem(poemId);
            setPoem(response.poem);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deletePoem = useCallback(async (poemId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.deletePoem(poemId);
            setPoems((prev) => prev.filter((p) => p.poem_id !== poemId));
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPoemsByLanguage = useCallback(async (language, limit = 5, before = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getPoemsByLanguage(language, limit, before);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPoemsBySeason = useCallback(async (season, limit = 5) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getPoemsBySeason(season, limit);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPoemsByLocation = useCallback(async (location, limit = 5) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getPoemsByLocation(location, limit);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getSeasonCounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.getSeasonCounts();
            setSeasonCounts(response.counts || {});
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const uploadPoemsCSV = useCallback(async (file) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await poemsService.uploadPoemsCSV(file);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        poems,
        poem,
        seasonCounts,
        isLoading,
        error,
        createPoem,
        getPoems,
        getPoem,
        deletePoem,
        getPoemsByLanguage,
        getPoemsBySeason,
        getPoemsByLocation,
        getSeasonCounts,
        uploadPoemsCSV,
        clearError,
    };
};
