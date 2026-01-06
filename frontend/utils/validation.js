/**
 * Validation utility functions
 */

export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: "Email is required" };
    }

    if (!email.includes("@")) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true, error: null };
};

export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
        return { isValid: false, error: "Password must be at least 6 characters long" };
    }

    return { isValid: true, error: null };
};

export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: "Name is required" };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: "Name must be at least 2 characters long" };
    }

    return { isValid: true, error: null };
};

export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { isValid: false, error: "Passwords do not match" };
    }

    return { isValid: true, error: null };
};

export const validateSignupForm = (formData) => {
    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
        return nameValidation;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }

    // Validate password match
    const passwordMatchValidation = validatePasswordMatch(
        formData.password,
        formData.confirmPassword
    );
    if (!passwordMatchValidation.isValid) {
        return passwordMatchValidation;
    }

    return { isValid: true, error: null };
};

export const validateLoginForm = (email, password) => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }

    return { isValid: true, error: null };
};
