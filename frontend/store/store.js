import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import chatReducer from './slice/chatSlice';
import sessionsReducer from './slice/sessionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        sessions: sessionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: {
        trace: true,
        traceLimit: 25,
    },
});

// Log state changes in development
if (__DEV__) {
    store.subscribe(() => {
        console.log('📊 Redux State:', {
            auth: store.getState().auth.isAuthenticated,
            chat: {
                messagesCount: store.getState().chat.messages.length,
                currentSessionId: store.getState().chat.currentSessionId,
            },
            sessions: {
                count: store.getState().sessions.sessions.length,
                current: store.getState().sessions.currentSession?.session_id,
            },
        });
    });
}

export const persistor = null; // Remove persist for now to see live updates
