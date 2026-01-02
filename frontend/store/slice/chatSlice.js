import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services';

const initialState = {
    messages: [],
    currentSessionId: null,
    isLoading: false,
    isSending: false,
    error: null,
    hasMore: true,
};

// Async thunks
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ message, sessionId }, { rejectWithValue }) => {
        try {
            const response = await chatService.sendMessage(message, sessionId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getChatHistory = createAsyncThunk(
    'chat/getChatHistory',
    async ({ limit = 10, before = null }, { rejectWithValue }) => {
        try {
            const response = await chatService.getChatHistory(limit, before);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteMessage = createAsyncThunk(
    'chat/deleteMessage',
    async (messageId, { rejectWithValue }) => {
        try {
            const response = await chatService.deleteMessage(messageId);
            return { messageId, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
            state.hasMore = true;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentSessionId: (state, action) => {
            state.currentSessionId = action.payload;
        },
        addOptimisticMessage: (state, action) => {
            state.messages.push({
                ...action.payload,
                isOptimistic: true,
            });
        },
    },
    extraReducers: (builder) => {
        // Send Message
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isSending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSending = false;
                // Add AI response to messages
                state.messages.push(action.payload.modelResponse);
                state.error = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isSending = false;
                state.error = action.payload;
            });

        // Get Chat History
        builder
            .addCase(getChatHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getChatHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.length === 0) {
                    state.hasMore = false;
                } else {
                    // Prepend older messages
                    state.messages = [...action.payload, ...state.messages];
                }
                state.error = null;
            })
            .addCase(getChatHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Delete Message
        builder
            .addCase(deleteMessage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = state.messages.filter(
                    (msg) => msg.message_id !== action.payload.messageId
                );
                state.error = null;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearMessages,
    clearError,
    setCurrentSessionId,
    addOptimisticMessage
} = chatSlice.actions;

export default chatSlice.reducer;
