import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    sendMessage,
    getChatHistory,
    deleteMessage,
    clearMessages,
    clearError,
    setCurrentSessionId,
    addOptimisticMessage,
} from '../store/slice/chatSlice';

export const useChat = () => {
    const dispatch = useDispatch();
    const {
        messages,
        currentSessionId,
        isLoading,
        isSending,
        error,
        hasMore
    } = useSelector((state) => state.chat);

    const handleSendMessage = useCallback(
        async (message, sessionId = null) => {
            // Add optimistic message
            const optimisticMsg = {
                message_id: `temp-${Date.now()}`,
                role: 'user',
                content: message,
                created_at: new Date().toISOString(),
            };
            dispatch(addOptimisticMessage(optimisticMsg));

            return dispatch(sendMessage({ message, sessionId: sessionId || currentSessionId })).unwrap();
        },
        [dispatch, currentSessionId]
    );

    const handleGetChatHistory = useCallback(
        async (limit = 10, before = null) => {
            console.log("🔵 useChat: Getting history for session:", currentSessionId);
            return dispatch(getChatHistory({ sessionId: currentSessionId, limit, before })).unwrap();
        },
        [dispatch, currentSessionId]
    );

    const handleDeleteMessage = useCallback(
        async (messageId) => {
            return dispatch(deleteMessage(messageId)).unwrap();
        },
        [dispatch]
    );

    const handleClearMessages = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSetCurrentSessionId = useCallback(
        (sessionId) => {
            dispatch(setCurrentSessionId(sessionId));
        },
        [dispatch]
    );

    return {
        messages,
        currentSessionId,
        isLoading,
        isSending,
        error,
        hasMore,
        sendMessage: handleSendMessage,
        getChatHistory: handleGetChatHistory,
        deleteMessage: handleDeleteMessage,
        clearMessages: handleClearMessages,
        clearError: handleClearError,
        setCurrentSessionId: handleSetCurrentSessionId,
    };
};
