import React, { createContext, useState, useEffect } from 'react';
import { getAuthTokenFromCookies } from '../utils/cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {

        const token = getAuthTokenFromCookies();

        if (token) {

            try {

                const response = await fetch('http://localhost:8080/validateToken', {

                    method: 'GET',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${token}`,

                    },

                });

                if (response.ok) {

                    setIsLoggedIn(true);

                } else {

                    setIsLoggedIn(false);

                }

            } catch (error) {

                console.error('Erro ao validar o token:', error);

                setIsLoggedIn(false);

            }

        } else {

            setIsLoggedIn(false);

        }

        setLoading(false);

    };

    useEffect(() => {

        checkAuth();

    }, []);

    return (

        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>

            {children}

        </AuthContext.Provider>

    );

};