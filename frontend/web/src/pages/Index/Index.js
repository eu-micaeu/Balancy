import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Index.css';

// Componentes
import Header from "../../components/Header/Header";

// Contexto de autenticação
import { AuthContext } from '../../contexts/AuthContext';

const Card = ({ title, description }) => (
    <div className="card">
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const FEATURES = [
    {
        title: "Planeje Suas Refeições",
        description: "Organize o seu dia com uma visão completa das refeições e mantenha uma alimentação balanceada."
    },
    {
        title: "Controle de Calorias",
        description: "Acompanhe o consumo diário e alcance seus objetivos de nutrição com facilidade."
    }
];

function Index() {
    const { isLoggedIn, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isLoggedIn) {
            navigate('/home', { replace: true });
        }
    }, [isLoggedIn, loading, navigate]);

    if (loading) {
        return <div>Carregando...</div>; // Exibe um loader enquanto verifica o status de login
    }

    return (
        <>
            <Header />
            <main>
                <h1>Balancy</h1>
                <p>Torne sua alimentação mais saudável, eficiente e organizada. Descubra funcionalidades incríveis:</p>
                <div className="cards-container">
                    {FEATURES.map((feature, index) => (
                        <Card key={index} title={feature.title} description={feature.description} />
                    ))}
                </div>
            </main>
        </>
    );
}

export default Index;
