import React, { createContext, useState, useEffect } from 'react';
import { getAuthTokenFromCookies } from '../utils/cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const apiUrl = process.env.REACT_APP_API_URL;


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    const checkAuth = async () => {

        const token = getAuthTokenFromCookies();

        if (token) {

            try {

                const response = await fetch(`${apiUrl}/validateToken`, {

                    method: 'GET',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${token}`,

                    },

                });

                if (response.ok) {

                    setIsLoggedIn(true);

                    // buscar perfil do usuário autenticado
                    try {
                        const profileRes = await fetch(`${apiUrl}/me`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        if (profileRes.ok) {
                            const profileData = await profileRes.json();
                            setUser(profileData);
                        }
                    } catch (err) {
                        console.error('Erro ao buscar perfil:', err);
                    }

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

        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading, user, setUser }}>

            {children}

        </AuthContext.Provider>

    );

};