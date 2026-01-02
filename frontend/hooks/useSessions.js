import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    createSession,
    getSessions,
    endSession,
    getSession,
    clearError,
    setCurrentSession,
    clearCurrentSession,
} from '../store/slice/sessionsSlice';

export const useSessions = () => {
    const dispatch = useDispatch();
    const { sessions, currentSession, isLoading, error } = useSelector(
        (state) => state.sessions
    );

    const handleCreateSession = useCallback(
        async (title = 'Untitled Session') => {
            return dispatch(createSession(title)).unwrap();
        },
        [dispatch]
    );

    const handleGetSessions = useCallback(async () => {
        return dispatch(getSessions()).unwrap();
    }, [dispatch]);

    const handleEndSession = useCallback(
        async (sessionId) => {
            return dispatch(endSession(sessionId)).unwrap();
        },
        [dispatch]
    );

    const handleGetSession = useCallback(
        async (sessionId) => {
            return dispatch(getSession(sessionId)).unwrap();
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSetCurrentSession = useCallback(
        (session) => {
            dispatch(setCurrentSession(session));
        },
        [dispatch]
    );

    const handleClearCurrentSession = useCallback(() => {
        dispatch(clearCurrentSession());
    }, [dispatch]);

    return {
        sessions,
        currentSession,
        isLoading,
        error,
        createSession: handleCreateSession,
        getSessions: handleGetSessions,
        endSession: handleEndSession,
        getSession: handleGetSession,
        clearError: handleClearError,
        setCurrentSession: handleSetCurrentSession,
        clearCurrentSession: handleClearCurrentSession,
    };
};
