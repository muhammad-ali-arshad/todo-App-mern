import { apiRequest } from "./api";

export const login = async (email, password) => {
    return await apiRequest('auth/login', 'POST', { email, password });
}

export const signup = async (userName,  email, password) => {
    return await apiRequest('auth/register', 'POST', { userName, email, password });
}