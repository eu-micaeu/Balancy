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
                        } else {
                            console.error('Erro ao buscar perfil:', profileRes.status);
                        }
                    } catch (err) {
                        console.error('Erro ao buscar perfil:', err);
                    }

                } else {

                    setIsLoggedIn(false);
                    setUser(null);
                    console.log('Token inválido');

                }

            } catch (error) {

                console.error('Erro ao validar o token:', error);

                setIsLoggedIn(false);

            }

        } else {

            setIsLoggedIn(false);
            setUser(null);
            console.log('Nenhum token encontrado');

        }

        setLoading(false);

    };

    useEffect(() => {

        checkAuth();

    }, []);

    return (

        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading, user, setUser, checkAuth }}>

            {children}

        </AuthContext.Provider>

    );

};