import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../Global.css';
import './Home.css';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import 'react-swipeable-list/dist/styles.css';

import Header from "../../components/Header/Header";

import PopUpAdicionarAlimento from '../../components/PopUps/PopUpAdicionarAlimento/PopUpAdicionarAlimento';

import PopUpAdicionarRefeicao from '../../components/PopUps/PopUpAdicionarRefeicao/PopUpAdicionarRefeicao';

function Home() {

    const apiUrl = process.env.REACT_APP_API_URL;

    const { isLoggedIn } = useContext(AuthContext);
    const { user } = useContext(AuthContext);

    const [menu, setMenu] = useState(null);

    const [error, setError] = useState(null);
    const [showCreateMenu, setShowCreateMenu] = useState(false);

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
            console.log('fetchMenu response:', data);
            setMenu(data.menu);
            setShowCreateMenu(false);

        } catch (error) {

            console.error('Erro ao carregar o menu:', error);

            setError(error.message);
            // Se a requisição retornar 404 (caso ocorra), mostrar botão criar menu
            if (String(error.message).includes('404')) {
                setShowCreateMenu(true);
            }

        }

    }, []);

    // Cria um menu para o usuário autenticado e recarrega
    const createMenu = async () => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
            },
        };

        try {
            const response = await fetch(`${apiUrl}/createMenu`, fetchOptions);
            if (!response.ok) {
                throw new Error('Erro ao criar o menu.');
            }
            setShowCreateMenu(false);
            // Recarrega o menu
            fetchMenu();
        } catch (err) {
            console.error(err.message || err);
        }
    };

    const [openRefeicao, setOpenRefeicao] = useState(false);

    const [openAlimento, setOpenAlimento] = useState(false);
    const [selectedMealForFood, setSelectedMealForFood] = useState(null);

    const handleOpenRefeicao = () => {
        console.log('Abrir popup adicionar refeição');
        setOpenRefeicao(true);
    };

    const handleCloseRefeicao = () => setOpenRefeicao(false);

    const handleOpenAlimento = (mealId = null) => {
        console.log('Abrir popup adicionar alimento', mealId);
        setSelectedMealForFood(mealId);
        setOpenAlimento(true);
    };

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

    // Edit meal name
    const [editingMealId, setEditingMealId] = useState(null);
    const [editingMealName, setEditingMealName] = useState('');

    const startEditingMeal = (meal) => {
        setEditingMealId(meal.meal_id);
        setEditingMealName(meal.meal_name);
    };

    const cancelEditingMeal = () => {
        setEditingMealId(null);
        setEditingMealName('');
    };

    const saveEditingMeal = async (mealId) => {
        const fetchOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthTokenFromCookies()}`,
            },
            body: JSON.stringify({ meal_name: editingMealName }),
        };
        try {
            const response = await fetch(`${apiUrl}/updateMeal/${mealId}`, fetchOptions);
            if (!response.ok) {
                throw new Error('Erro ao atualizar a refeição.');
            }
            // Refresh menu and clear edit state
            await fetchMenu();
            cancelEditingMeal();
        } catch (error) {
            console.error(error.message);
            alert('Erro ao atualizar a refeição. Tente novamente.');
        }
    };


    useEffect(() => {

        if (isLoggedIn) {

            fetchMenu();

        }

    }, [isLoggedIn, fetchMenu]);


    const hasMenu = menu && Number(menu.menu_id) > 0;

    // Early-return pattern to simplify JSX and avoid nested ternaries
    if (!isLoggedIn) {
        return (
            <>
                <Header />
                <main>
                    <div className="menu-guest">
                        <h1>Bem-vindo ao Balancy</h1>
                        <p>Faça login para visualizar e gerenciar suas refeições.</p>
                    </div>
                </main>
            </>
        );
    }

    // Usuário logado
    return (
        <>
            <Header />
            <main>
                <div className="menu-container">
                    {!menu ? (
                        <Typography variant="body1" align="center">Carregando menu...</Typography>
                    ) : !hasMenu ? (
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="body1" align="center" style={{ marginBottom: 12 }}>
                                Você ainda não possui um menu.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={createMenu} startIcon={<AddIcon />}>
                                Criar Menu
                            </Button>
                        </div>
                    ) : ( // tem menu
                        <>
                            {/* Calorias summary */}

                            {menu.meals && menu.meals.length > 0 ? (
                                <div className="meals-container">
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">
                                                        <Typography variant="h6" style={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                                                            Seu Menu
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {menu.meals.map((meal) => (
                                                    <React.Fragment key={meal.meal_id}>
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="left" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                                                                {editingMealId === meal.meal_id ? (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <input
                                                                            value={editingMealName}
                                                                            onChange={(e) => setEditingMealName(e.target.value)}
                                                                            style={{ flex: 1, padding: '6px', fontSize: '1rem' }}
                                                                        />
                                                                        <Button variant="contained" color="primary" size="small" onClick={() => saveEditingMeal(meal.meal_id)}>Salvar</Button>
                                                                        <Button variant="outlined" color="secondary" size="small" onClick={cancelEditingMeal}>Cancelar</Button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <span title="Nome da refeição">{meal.meal_name}</span>
                                                                        <DeleteIcon
                                                                            style={{ color: '#c62828', cursor: 'pointer', float: 'right', marginLeft: 8 }}
                                                                            titleAccess="Excluir refeição"
                                                                            onClick={() => deleteMeal(meal.meal_id)}
                                                                        />
                                                                        <EditIcon
                                                                            style={{ color: '#1976d2', cursor: 'pointer', float: 'right', marginLeft: 8 }}
                                                                            titleAccess="Editar refeição"
                                                                            onClick={() => startEditingMeal(meal)}
                                                                        />
                                                                        <AddIcon
                                                                            style={{ color: '#43cea2', cursor: 'pointer', float: 'right', marginLeft: 8 }}
                                                                            titleAccess="Adicionar alimento"
                                                                            onClick={() => handleOpenAlimento(meal.meal_id)}
                                                                        />
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>

                                                        {meal.foods && meal.foods.length > 0 ? (
                                                            <>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
                                                                        <strong>Nome do Alimento</strong>
                                                                    </TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
                                                                        <strong>Quantidade (g/ml)</strong>
                                                                    </TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
                                                                        <strong>Calorias (kcal)</strong>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {meal.foods.map((food) => (
                                                                    <TableRow key={food.food_id}>
                                                                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>{food.food_name}</TableCell>
                                                                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>{food.quantity}</TableCell>
                                                                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>{food.calories}</TableCell>
                                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                                            <DeleteIcon
                                                                                style={{ color: '#c62828', cursor: 'pointer' }}
                                                                                titleAccess="Excluir alimento"
                                                                                onClick={() => deleteFood(food.food_id)}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                                                                    Nenhum alimento adicionado nesta refeição.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                                        <Button variant="contained" color="primary" onClick={handleOpenRefeicao} startIcon={<AddIcon />}>Adicionar Refeição</Button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '50px', alignItems: 'center' }}>
                                        {user ? (
                                            (() => {
                                                const age = Number(user.age) || 0;
                                                const weight = Number(user.weight) || 0; // kg
                                                const height = Number(user.height) || 0; // cm
                                                const gender = (user.gender || '').toLowerCase();

                                                // Mifflin-St Jeor para TMB (Taxa Metabólica Basal)
                                                let tmb = 0;
                                                if (gender === 'male' || gender === 'masculino' || gender === 'm') {
                                                    tmb = 10 * weight + 6.25 * height - 5 * age + 5;
                                                } else {
                                                    tmb = 10 * weight + 6.25 * height - 5 * age - 161;
                                                }

                                                // Fator de atividade física para calcular TDEE
                                                const activity = (user.activity_level || '').toLowerCase();
                                                let activityFactor = 1.2;
                                                if (activity.includes('sedent') || activity === 'sedentary') activityFactor = 1.2;
                                                else if (activity.includes('light')) activityFactor = 1.375;
                                                else if (activity.includes('moderate')) activityFactor = 1.55;
                                                else if (activity.includes('active') || activity.includes('very')) activityFactor = 1.725;
                                                else if (activity.includes('extra')) activityFactor = 1.9;

                                                // TDEE (Total Daily Energy Expenditure) = TMB × Fator de Atividade
                                                const tdee = Math.round(tmb * activityFactor);

                                                // soma calorias consumidas no menu
                                                let consumed = 0;
                                                if (menu && menu.meals) {
                                                    menu.meals.forEach((m) => {
                                                        if (m.foods && m.foods.length > 0) {
                                                            m.foods.forEach((f) => {
                                                                consumed += Number(f.calories) || 0;
                                                            });
                                                        }
                                                    });
                                                }

                                                const deficit = tdee - consumed;

                                                // Determina o status baseado no déficit
                                                let status = '';
                                                let statusColor = '#43cea2'; // verde padrão

                                                if (deficit >= 500) {
                                                    status = 'Déficit Agressivo (≥500 kcal)';
                                                    statusColor = '#e74c3c'; // vermelho
                                                } else if (deficit >= 300) {
                                                    status = `Déficit Moderado (${deficit} kcal)`;
                                                    statusColor = '#f39c12'; // laranja
                                                } else if (deficit > 50) {
                                                    status = `Déficit Leve (${deficit} kcal)`;
                                                    statusColor = '#27ae60'; // verde
                                                } else if (deficit >= -50) {
                                                    status = 'Manutenção';
                                                    statusColor = '#3498db'; // azul
                                                } else {
                                                    status = `Excedeu ${-deficit} kcal`;
                                                    statusColor = '#e74c3c'; // vermelho
                                                }

                                                return (
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        margin: '10px',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{ marginBottom: 4 }}>
                                                                <strong>TDEE (Gasto Calórico Diário):</strong> {tdee} kcal
                                                            </div>
                                                            <div style={{ marginBottom: 4 }}>
                                                                <strong>Consumido:</strong> {consumed} kcal
                                                            </div>
                                                            <div style={{ fontSize: '0.9em', color: '#666' }}>
                                                                TMB: {Math.round(tmb)} kcal | Fator atividade: {activityFactor}x
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="calories-badge"
                                                            style={{ backgroundColor: statusColor }}
                                                            title={
                                                                deficit >= 0
                                                                    ? `Déficit de ${deficit} kcal para manutenção`
                                                                    : `Excedeu em ${-deficit} kcal`
                                                            }
                                                        >
                                                            {status}
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div>Carregando dados do usuário...</div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <Typography variant="body1" align="center" style={{ marginBottom: 12 }}>Nenhuma refeição disponível no momento.</Typography>
                                    <div style={{ marginTop: '20px' }}>
                                        <Button variant="contained" color="secondary" onClick={handleOpenRefeicao} startIcon={<AddIcon />} fullWidth>Adicionar Refeição</Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Popups: Refeição pode ser adicionada mesmo que não haja refeições ainda */}
                {hasMenu && (
                    <PopUpAdicionarRefeicao open={openRefeicao} handleClose={handleCloseRefeicao} fetchMenu={fetchMenu} meals={menu.meals} />
                )}
                {hasMenu && (
                    <PopUpAdicionarAlimento open={openAlimento} handleClose={() => { handleCloseAlimento(); setSelectedMealForFood(null); }} fetchMenu={fetchMenu} meals={menu.meals} selectedMealId={selectedMealForFood} />
                )}
            </main>
        </>
    );

}

export default Home;