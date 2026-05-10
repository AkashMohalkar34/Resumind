import axios from "axios";

// export const baseURLL = "http://localhost:8080";
export const baseURLL = import.meta.env.VITE_API_URL;
const AUTH_STORAGE_KEY = "resume-auth-user";

export const axiosInstance = axios.create({
    baseURL: baseURLL,
});

export const signupUser = async (payload) => {
    const response = await axiosInstance.post("/api/auth/signup", payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await axiosInstance.post("/api/auth/login", payload);
    return response.data;
};

export const generateResume = async (description) => {

    const response = await axiosInstance.post("/api/generate", {
        userDescription: description,

    });

    return response.data;
}

export const matchJobsFromResume = async (payload) => {
    const response = await axiosInstance.post("/api/jobs/match", payload);
    return response.data;
};

export const sendTeamFeedback = async (payload) => {
    const response = await axiosInstance.post("/api/feedback", payload);
    return response.data;
};

export const saveAuthenticatedUser = (user) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthenticatedUser = () => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
};

export const isAuthenticated = () => Boolean(getAuthenticatedUser());

export const logoutUser = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
};
