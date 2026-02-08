import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    login,
    signup,
    googleLogin,
    logout,
    getProfile,
    checkAuth,
    clearError,
    setUser,
} from '../store/slice/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, isLoading, error } = useSelector(
        (state) => state.auth
    );

    const handleLogin = useCallback(
        async (email, password) => {
            return dispatch(login({ email, password })).unwrap();
        },
        [dispatch]
    );

    const handleSignup = useCallback(
        async (userData) => {
            return dispatch(signup(userData)).unwrap();
        },
        [dispatch]
    );

    const handleGoogleLogin = useCallback(
        async (token) => {
            return dispatch(googleLogin(token)).unwrap();
        },
        [dispatch]
    );

    const handleLogout = useCallback(async () => {
        return dispatch(logout()).unwrap();
    }, [dispatch]);

    const handleGetProfile = useCallback(async () => {
        return dispatch(getProfile()).unwrap();
    }, [dispatch]);

    const handleCheckAuth = useCallback(async () => {
        return dispatch(checkAuth()).unwrap();
    }, [dispatch]);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSetUser = useCallback(
        (userData) => {
            dispatch(setUser(userData));
        },
        [dispatch]
    );

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        signup: handleSignup,
        googleLogin: handleGoogleLogin,
        logout: handleLogout,
        getProfile: handleGetProfile,
        checkAuth: handleCheckAuth,
        clearError: handleClearError,
        setUser: handleSetUser,
    };
};
