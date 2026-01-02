import { useState, useCallback } from 'react';
import { calendarService } from '../services';

export const useCalendar = () => {
    const [calendarData, setCalendarData] = useState(null);
    const [myCalendar, setMyCalendar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCalendarMonth = useCallback(async (year, month, calendar = 'gregorian') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await calendarService.getCalendarMonth(year, month, calendar);
            setCalendarData(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getMyCalendar = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await calendarService.getMyCalendar();
            setMyCalendar(response);
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
        calendarData,
        myCalendar,
        isLoading,
        error,
        getCalendarMonth,
        getMyCalendar,
        clearError,
    };
};
