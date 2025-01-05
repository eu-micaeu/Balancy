import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getAuthTokenFromCookies } from '../../utils/cookies';
import './Main.css';
import PopUpAdicionarAlimento from '../PopUps/PopUpAdicionarAlimento/PopUpAdicionarAlimento';
import PopUpAdicionarRefeicao from '../PopUps/PopUpAdicionarRefeicao/PopUpAdicionarRefeicao';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


function Main() {
    const { isLoggedIn } = useContext(AuthContext);
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchMenu = useCallback(async () => {
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
            },
        };
        try {
            const response = await fetch('http://localhost:8080/readMenu', fetchOptions);
            if (!response.ok) {
                throw new Error(`Erro da API: ${response.status}`);
            }
            const data = await response.json();
            setMenu(data.menu);
        } catch (error) {
            console.error('Erro ao carregar o menu:', error);
            setError(error.message);
        }
    }, []);

    // Função para deletar um alimento
    const handleDeleteFood = async (food_id) => {
        console.log("ID do alimento a ser deletado:", food_id); // Isso ajuda a verificar se o ID está correto
        if (!food_id) {
            alert("Erro: ID do alimento não encontrado.");
            return;
        }

        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
            },
        };

        try {
            const response = await fetch(`http://localhost:8080/deleteFood/${food_id}`, fetchOptions);
            if (!response.ok) {
                throw new Error(`Erro ao deletar o alimento: ${response.status}`);
            }
            console.log(`Alimento com ID ${food_id} foi deletado com sucesso.`);
            await fetchMenu(); // Atualiza o menu após a remoção
        } catch (error) {
            console.error('Erro ao apagar o alimento:', error);
            alert('Erro ao tentar apagar o alimento. Por favor, tente novamente.');
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMenu();
        }
    }, [isLoggedIn, fetchMenu]);

    const [openRefeicao, setOpenRefeicao] = useState(false);
    const [openAlimento, setOpenAlimento] = useState(false);

    const handleOpenRefeicao = () => setOpenRefeicao(true);
    const handleCloseRefeicao = () => setOpenRefeicao(false);

    const handleOpenAlimento = () => setOpenAlimento(true);
    const handleCloseAlimento = () => setOpenAlimento(false);

    return (
        <main className="main-container">
            {isLoggedIn ? (
                <div className="menu-container">
                    {menu ? (
                        <>
                            <div className="menu-header">
                                <h2 className="menu-title">Seu Menu</h2>
                            </div>
                            {menu.meals && menu.meals.length > 0 ? (
                                <div className="meals-container">
                                    <table className="menu-table">
                                        <tbody>
                                        {menu.meals.map((meal) => (
                                            <React.Fragment key={meal.meal_id}>
                                                <tr>
                                                    <td colSpan="5"
                                                        style={{fontWeight: 'bold', backgroundColor: '#f4f4f4'}}>
                                                        {meal.meal_name}
                                                    </td>
                                                </tr>
                                                {meal.foods && meal.foods.length > 0 ? (
                                                    <>
                                                        <tr>
                                                            <th></th>
                                                            <th>Nome do Alimento</th>
                                                            <th>Quantidade (g/ml)</th>
                                                            <th>Calorias (kcal)</th>
                                                            <th></th>
                                                        </tr>
                                                        {meal.foods.map((food, index) => (
                                                            <tr key={`${meal.meal_id}-food-${index}`}>
                                                                <td></td>
                                                                <td>{food.food_name}</td>
                                                                <td>{food.quantity}</td>
                                                                <td>{food.calories}</td>
                                                                <td>
                                                                    <IconButton
                                                                        color="secondary"
                                                                        size="small"
                                                                        onClick={() => handleDeleteFood(food.food_id)}
                                                                    >
                                                                        <DeleteIcon/>
                                                                    </IconButton>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <tr style={{fontStyle: 'italic'}}>
                                                        <td colSpan="5">Nenhum alimento adicionado nesta refeição.</td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div className="add-meal-container">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleOpenRefeicao} // Atualize aqui
                                            style={{
                                                margin: '20px 0',
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none',
                                                color: '#e91e63'
                                            }}
                                        >
                                            <AddIcon
                                                style={{
                                                    width: '50px',
                                                    color: '#e91e63',
                                                }}
                                            />
                                            Adicionar Refeição ao Menu
                                        </Button>
                                        <PopUpAdicionarRefeicao
                                            open={openRefeicao}
                                            handleClose={handleCloseRefeicao}
                                            fetchMenu={fetchMenu}
                                            meals={menu.meals}
                                        />
                                    </div>
                                    <div className="add-food-container">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleOpenAlimento}
                                            style={{
                                                margin: '20px 0',
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none',
                                                color: '#e91e63'
                                            }}
                                        >
                                            <AddIcon
                                                style={{
                                                    width: '50px',
                                                    color: '#e91e63',
                                                }}
                                            />
                                            Adicionar Alimento na Refeição
                                        </Button>
                                        <PopUpAdicionarAlimento
                                            open={openAlimento}
                                            handleClose={handleCloseAlimento}
                                            fetchMenu={fetchMenu}
                                            meals={menu.meals}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="no-meals-message">
                                    <p>Nenhuma refeição disponível no momento.</p>
                                </div>
                            )}
                        </>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <p>Carregando menu...</p>
                    )}
                </div>
            ) : (
                <div className="menu-guest">
                    <h1 className="main-title">Balancy</h1>
                    <p className="subtitle">
                        Torne sua alimentação mais saudável, eficiente e organizada. Descubra funcionalidades incríveis:
                    </p>
                    <div className="cards-container">
                        <div className="card">
                            <h3>Planeje Suas Refeições</h3>
                            <p>
                                Organize o seu dia com uma visão completa das refeições e mantenha uma alimentação
                                balanceada.
                            </p>
                        </div>
                        <div className="card">
                            <h3>Controle de Calorias</h3>
                            <p>
                                Acompanhe o consumo diário e alcance seus objetivos de nutrição com facilidade.
                            </p>
                        </div>
                    </div>
                    <section className="testimonials">
                        <h2>O que nossos usuários dizem:</h2>
                        <div className="testimonial-cards">
                            <div className="testimonial-card">
                                <p>
                                    "O Balancy transformou minha rotina alimentar. Agora consigo me organizar e manter uma dieta mais saudável!"
                                </p>
                                <span>– Maria Silva</span>
                            </div>
                            <div className="testimonial-card">
                                <p>
                                    "Com o controle de calorias, alcancei meus objetivos em poucos meses. Recomendo a todos!"
                                </p>
                                <span>– Ana Costa</span>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default Main;