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

