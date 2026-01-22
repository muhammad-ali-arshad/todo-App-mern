import React, { createContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "@/utils/tokenStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getToken();
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (token) => {
        await saveToken(token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
