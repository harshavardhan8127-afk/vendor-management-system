import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ username: decoded.sub });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        const { token } = res.data;
        localStorage.setItem('token', token);
        let decoded;
        try {
            decoded = jwtDecode(token);
            setUser({ username: decoded.sub });
        } catch (err) {
            // If decoding fails, clear token and treat as not logged in
            localStorage.removeItem('token');
            throw err;
        }
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
