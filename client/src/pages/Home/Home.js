import React, { useContext, useEffect, useState, useCallback } from 'react';

import '../Global.css';

import { AuthContext } from '../../contexts/AuthContext';

import { getAuthTokenFromCookies } from '../../utils/cookies';

import {

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Paper,

    Button,

    Typography,

} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import 'react-swipeable-list/dist/styles.css';

import Header from "../../components/Header/Header";

import Footer from "../../components/Footer/Footer";

import PopUpAdicionarAlimento from '../../components/PopUps/PopUpAdicionarAlimento/PopUpAdicionarAlimento';

import PopUpAdicionarRefeicao from '../../components/PopUps/PopUpAdicionarRefeicao/PopUpAdicionarRefeicao';

function Home() {

    const apiUrl = process.env.REACT_APP_API_URL;

    const { isLoggedIn } = useContext(AuthContext);

    const [menu, setMenu] = useState(null);

    const [error, setError] = useState(null);

    const fetchMenu = useCallback(async () => {

        const fetchOptions = {

            method: 'GET',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,

            },

        };

        try {

            const response = await fetch(`${apiUrl}/readMenu`, fetchOptions);

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

    const [openRefeicao, setOpenRefeicao] = useState(false);

    const [openAlimento, setOpenAlimento] = useState(false);

    const handleOpenRefeicao = () => setOpenRefeicao(true);

    const handleCloseRefeicao = () => setOpenRefeicao(false);

    const handleOpenAlimento = () => setOpenAlimento(true);

    const handleCloseAlimento = () => setOpenAlimento(false);

    const deleteFood = async (foodId) => {

        const fetchOptions = {

            method: 'DELETE',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,

            },

        };

        try {

            const response = await fetch(`${apiUrl}/deleteFood/${foodId}`, fetchOptions);

            if (!response.ok) {

                throw new Error('Erro ao excluir o alimento.');

            }

            fetchMenu();

        } catch (error) {

            console.error(error.message);

        }

    };

    const deleteMeal = async (mealId) => {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
            },
        };
        try {
            const response = await fetch(`${apiUrl}/deleteMeal/${mealId}`, fetchOptions);
            if (!response.ok) {
                throw new Error('Erro ao excluir a refeição.');
            }
            fetchMenu(); // Atualiza o menu após a exclusão
        } catch (error) {
            console.error(error.message);
        }
    };


    useEffect(() => {

        if (isLoggedIn) {

            fetchMenu();

        }

    }, [isLoggedIn, fetchMenu]);

    return (

        <>

            <Header />

            <main>

                {isLoggedIn ? (

                    <div className="menu-container">

                        {menu ? (

                            <>

                                {menu.meals && menu.meals.length > 0 ? (

                                    <div className="meals-container">

                                        <TableContainer component={Paper}>

                                            <Table>

                                                <TableHead>

                                                    <TableRow>

                                                        <TableCell colSpan={4} align="center">

                                                            <Typography variant="h6" style={{

                                                                fontWeight: 'bold',

                                                                fontFamily: 'Poppins, sans-serif',

                                                            }}>

                                                                Seu Menu

                                                            </Typography>

                                                        </TableCell>

                                                    </TableRow>

                                                </TableHead>

                                                <TableBody>
                                                    {menu.meals.map((meal) => (
                                                        <React.Fragment key={meal.meal_id}>
                                                            <TableRow
                                                                onClick={() => deleteMeal(meal.meal_id)}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        backgroundColor: '#fce4ec', 
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell
                                                                    colSpan={4}
                                                                    align="left"
                                                                    title='Clique para excluir a refeição'
                                                                    sx={{
                                                                        backgroundColor: '#f5f5f5',
                                                                        fontWeight: 'bold',
                                                                        fontFamily: 'Poppins, sans-serif',
                                                                        '&:hover': {
                                                                            backgroundColor: '#ffcccc',
                                                                        },
                                                                    }}
                                                                >
                                                                    {meal.meal_name}
                                                                </TableCell>
                                                            </TableRow>

                                                            {meal.foods && meal.foods.length > 0 ? (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            sx={{
                                                                                fontWeight: 'bold',
                                                                                fontFamily: 'Poppins, sans-serif',
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            <strong>Nome do Alimento</strong>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                fontWeight: 'bold',
                                                                                fontFamily: 'Poppins, sans-serif',
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            <strong>Quantidade (g/ml)</strong>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                fontWeight: 'bold',
                                                                                fontFamily: 'Poppins, sans-serif',
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            <strong>Calorias (kcal)</strong>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {meal.foods.map((food) => (

                                                                        <TableRow

                                                                            key={food.food_id}

                                                                            title="Clique para excluir o alimento"

                                                                            onClick={() => deleteFood(food.food_id)}

                                                                            sx={{
                                                                                cursor: 'pointer',
                                                                                '&:hover': {
                                                                                    backgroundColor: '#ffcccc',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <TableCell
                                                                                sx={{
                                                                                    fontWeight: 'bold',
                                                                                    fontFamily: 'Poppins, sans-serif',
                                                                                    textAlign: 'center',
                                                                                }}
                                                                            >
                                                                                {food.food_name}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                sx={{
                                                                                    fontWeight: 'bold',
                                                                                    fontFamily: 'Poppins, sans-serif',
                                                                                    textAlign: 'center',
                                                                                }}
                                                                            >
                                                                                {food.quantity}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                sx={{
                                                                                    fontWeight: 'bold',
                                                                                    fontFamily: 'Poppins, sans-serif',
                                                                                    textAlign: 'center',
                                                                                }}
                                                                            >
                                                                                {food.calories}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <TableRow>

                                                                    <TableCell colSpan={4} align="center"
                                                                    
                                                                    sx={{

                                                                        fontWeight: 'bold',

                                                                        fontFamily: 'Poppins, sans-serif',

                                                                    }}

                                                                    >

                                                                        Nenhum alimento adicionado nesta refeição.

                                                                    </TableCell>

                                                                </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>


                                            </Table>

                                        </TableContainer>

                                        <div

                                            style={{

                                                display: 'flex',

                                                justifyContent: 'center',

                                                gap: '16px',

                                                marginTop: '20px',

                                            }}

                                        >

                                            <Button

                                                variant="contained"

                                                color="primary"

                                                onClick={handleOpenRefeicao}

                                                startIcon={<AddIcon />}

                                            >

                                                Adicionar Refeição

                                            </Button>

                                            <Button

                                                variant="contained"

                                                color="secondary"

                                                onClick={handleOpenAlimento}

                                                startIcon={<AddIcon />}

                                            >

                                                Adicionar Alimento

                                            </Button>

                                        </div>

                                        <PopUpAdicionarRefeicao

                                            open={openRefeicao}

                                            handleClose={handleCloseRefeicao}

                                            fetchMenu={fetchMenu}

                                            meals={menu.meals}

                                        />

                                        <PopUpAdicionarAlimento

                                            open={openAlimento}

                                            handleClose={handleCloseAlimento}

                                            fetchMenu={fetchMenu}

                                            meals={menu.meals}

                                        />

                                    </div>

                                ) : (

                                    <Typography variant="body1" align="center">

                                        Nenhuma refeição disponível no momento.

                                    </Typography>

                                )}

                            </>

                        ) : (

                            <Typography variant="body1" align="center">

                                Carregando menu...

                            </Typography>

                        )}

                    </div>

                ) : (

                    <div className="menu-guest">

                        <h1>Bem-vindo ao Balancy</h1>

                        <p>Faça login para visualizar e gerenciar suas refeições.</p>

                    </div>

                )}

            </main>

            <Footer />

        </>

    );

}

export default Home;