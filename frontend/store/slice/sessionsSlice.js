import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionsService } from '../../services';

const initialState = {
    sessions: [],
    currentSession: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const createSession = createAsyncThunk(
    'sessions/createSession',
    async (title = 'Untitled Session', { rejectWithValue }) => {
        try {
            const response = await sessionsService.createSession(title);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getSessions = createAsyncThunk(
    'sessions/getSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await sessionsService.getSessions();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const endSession = createAsyncThunk(
    'sessions/endSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await sessionsService.endSession(sessionId);
            return { sessionId, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getSession = createAsyncThunk(
    'sessions/getSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await sessionsService.getSession(sessionId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentSession: (state, action) => {
            state.currentSession = action.payload;
        },
        clearCurrentSession: (state) => {
            state.currentSession = null;
        },
    },
    extraReducers: (builder) => {
        // Create Session
        builder
            .addCase(createSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions.unshift(action.payload.session);
                state.currentSession = action.payload.session;
                state.error = null;
            })
            .addCase(createSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Get Sessions
        builder
            .addCase(getSessions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload.sessions || [];
                state.error = null;
            })
            .addCase(getSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // End Session
        builder
            .addCase(endSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(endSession.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update the session status in the list
                const sessionIndex = state.sessions.findIndex(
                    (s) => s.session_id === action.payload.sessionId
                );
                if (sessionIndex !== -1) {
                    state.sessions[sessionIndex].status = 'ended';
                    state.sessions[sessionIndex].ended_at = new Date().toISOString();
                }
                // Clear current session if it's the one being ended
                if (state.currentSession?.session_id === action.payload.sessionId) {
                    state.currentSession = null;
                }
                state.error = null;
            })
            .addCase(endSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Get Session
        builder
            .addCase(getSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSession = action.payload.session;
                state.error = null;
            })
            .addCase(getSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    setCurrentSession,
    clearCurrentSession
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
