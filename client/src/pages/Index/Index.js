import React from 'react';
import './Index.css';

// Componentes
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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

            <Footer />

        </>

    );

}

export default Index;