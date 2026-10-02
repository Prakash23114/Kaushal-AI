import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed. Please try again.";
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
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Login failed. Please check your credentials.";
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
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
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
    window.location.href = "http://localhost:4000/api/auth/google";
}

/**
 * Authenticates with Google ID token from frontend SDK
 */
export async function googleTokenLogin(credential) {
    try {
        const response = await api.post("/google/token", { credential });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Google authentication failed. Please try again.";
        throw new Error(message);
    }
}



