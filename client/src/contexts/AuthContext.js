import React, { createContext, useState, useEffect } from 'react';
import { getAuthTokenFromCookies } from '../utils/cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado padrão
    const [loading, setLoading] = useState(true); // Adiciona um estado para controlar o carregamento inicial

    // Função para verificar o estado de login
    const checkAuth = async () => {
        const token = getAuthTokenFromCookies();

        if (token) {
            try {
                // Opcional: Fazer uma requisição ao back-end para validar o token
                const response = await fetch('http://localhost:8080/validateToken', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsLoggedIn(true); // Token válido
                } else {
                    setIsLoggedIn(false); // Token inválido ou expirado
                }
            } catch (error) {
                console.error('Erro ao validar o token:', error);
                setIsLoggedIn(false); // Assume não logado em caso de erro
            }
        } else {
            setIsLoggedIn(false); // Sem token significa não autenticado
        }

        setLoading(false); // Finaliza o carregamento
    };

    // useEffect para revalidar o login ao carregar a aplicação
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};