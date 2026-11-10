import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
    withCredentials: true
});

// Attach Authorization Bearer token header from localStorage if available
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("kaushal_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage may be disabled in some environments
    }
    return config;
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || (error.code === 'ERR_NETWORK' ? "Unable to connect to server. Please check your internet connection." : "Registration failed. Please try again.");
        const err = new Error(message);
        err.response = error.response;
        throw err;
    }
}

export async function verifyOtp({ email, otp }) {
    try {
        const response = await api.post("/verify-otp", {
            email,
            otp
        });
        if (response.data?.token) {
            try {
                localStorage.setItem("kaushal_token", response.data.token);
            } catch (e) {}
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "OTP verification failed. Please try again.";
        throw new Error(message);
    }
}

export async function resendOtp({ email }) {
    try {
        const response = await api.post("/resend-otp", {
            email
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to resend verification code.";
        throw new Error(message);
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/login", {
            email,
            password
        });
        if (response.data?.token) {
            try {
                localStorage.setItem("kaushal_token", response.data.token);
            } catch (e) {}
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message;
        if (!message) {
            if (error.code === 'ERR_NETWORK' || !error.response) {
                message = "Unable to connect to the backend server. The service may be waking up (Render free tier takes ~45s on cold start). Please wait a moment and try again.";
            } else {
                message = "Login failed. Please check your credentials.";
            }
        }
        const err = new Error(message);
        err.response = error.response;
        if (error.response?.data?.requiresVerification) {
            err.requiresVerification = true;
            err.email = error.response.data.email;
        }
        throw err;
    }
}

export async function forgotPassword({ email }) {
    try {
        const response = await api.post("/forgot-password", { email });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to send reset code. Please check your email.";
        throw new Error(message);
    }
}

export async function resetPassword({ email, otp, newPassword }) {
    try {
        const response = await api.post("/reset-password", {
            email,
            otp,
            newPassword
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Failed to reset password. Please check the code.";
        throw new Error(message);
    }
}

export async function logout() {
    try {
        const response = await api.post("/logout", {});
        try {
            localStorage.removeItem("kaushal_token");
        } catch (e) {}
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        try {
            localStorage.removeItem("kaushal_token");
        } catch (e) {}
    }
}

export async function getMe() {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        console.warn("User not authenticated or session expired");
        return null;
    }
}

/**
 * Redirects the browser to Google OAuth authorization endpoint
 */
export function loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
}

/**
 * Authenticates with Google ID token from frontend SDK
 */
export async function googleTokenLogin(credential) {
    try {
        const response = await api.post("/google/token", { credential });
        if (response.data?.token) {
            try {
                localStorage.setItem("kaushal_token", response.data.token);
            } catch (e) {}
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Google authentication failed. Please try again.";
        throw new Error(message);
    }
}



