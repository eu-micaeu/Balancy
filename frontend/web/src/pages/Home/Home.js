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

                                    <div style={{ margin: '20px 0' }}>
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
                                                    status = `Déficit Agressivo (${deficit} kcal)`;
                                                    statusColor = '#e74c3c'; // vermelho
                                                } else if (deficit >= 300) {
                                                    status = `Déficit Moderado (${deficit} kcal)`;
                                                    statusColor = '#f39c12'; // laranja
                                                } else if (deficit > 50) {
                                                    status = `Déficit Leve (${deficit} kcal)`;
                                                    statusColor = '#27ae60'; // verde
                                                } else if (deficit >= -50) {
                                                    status = `Manutenção (${deficit} kcal)`;
                                                    statusColor = '#3498db'; // azul
                                                } else {
                                                    status = `Excedeu ${-deficit} kcal`;
                                                    statusColor = '#e74c3c'; // vermelho
                                                }

                                                // Calcula as calorias restantes para diferentes objetivos
                                                const remainingForMaintenance = Math.max(0, tdee - consumed);
                                                const remainingForModerateDeficit = Math.max(0, (tdee - 300) - consumed);
                                                const remainingForAggressiveDeficit = Math.max(0, (tdee - 500) - consumed);

                                                return (
                                                    <div className="calories-summary" style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        background: '#dadadaff',
                                                        borderRadius: '16px',
                                                        padding: '24px',
                                                        margin: '20px auto',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                                    }}>
                                                        {/* Título Principal */}
                                                        <Typography variant="h6" style={{
                                                            fontWeight: 'bold',
                                                            color: '#2c3e50',
                                                            marginBottom: '16px',
                                                            textAlign: 'center'
                                                        }}>
                                                            📊 Resumo Calórico Diário
                                                        </Typography>

                                                        {/* Informações Principais */}
                                                        <div className="grid-container" style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                            gap: '16px',
                                                            width: '100%',
                                                            marginBottom: '20px'
                                                        }}>
                                                            <div style={{
                                                                background: 'white',
                                                                padding: '16px',
                                                                borderRadius: '12px',
                                                                textAlign: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                                            }}>
                                                                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '4px' }}>TDEE (Gasto Diário)</div>
                                                                <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2c3e50' }}>{tdee} kcal</div>
                                                                <div style={{ fontSize: '0.75em', color: '#888', marginTop: '4px' }}>
                                                                    TMB: {Math.round(tmb)} × {activityFactor}
                                                                </div>
                                                            </div>

                                                            <div style={{
                                                                background: 'white',
                                                                padding: '16px',
                                                                borderRadius: '12px',
                                                                textAlign: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                                            }}>
                                                                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '4px' }}>Consumido Hoje</div>
                                                                <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#e74c3c' }}>{consumed} kcal</div>
                                                                <div style={{ fontSize: '0.75em', color: '#888', marginTop: '4px' }}>
                                                                    {((consumed / tdee) * 100).toFixed(0)}% do TDEE
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div
                                                            style={{
                                                                backgroundColor: statusColor,
                                                                color: 'white',
                                                                padding: '12px 24px',
                                                                borderRadius: '25px',
                                                                fontSize: '1.1em',
                                                                fontWeight: 'bold',
                                                                marginBottom: '16px',
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                                textAlign: 'center'
                                                            }}
                                                            title={
                                                                deficit >= 0
                                                                    ? `Déficit de ${deficit} kcal para manutenção`
                                                                    : `Excedeu em ${-deficit} kcal`
                                                            }
                                                        >
                                                            {status}
                                                        </div>

                                                        {/* Dica útil */}
                                                        <div style={{
                                                            fontSize: '0.8em',
                                                            color: '#7f8c8d',
                                                            textAlign: 'center',
                                                            marginTop: '12px',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            💡 Déficit de 300-500 kcal/dia = perda de ~0,3-0,5 kg/semana
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.8em',
                                                            color: '#7f8c8d',
                                                            textAlign: 'center',
                                                            marginTop: '12px',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            💡 Déficit de 500-1000 kcal/dia = perda de ~0,5-1 kg/semana
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div>Carregando dados do usuário...</div>
                                        )}

                                        {user && (user.target_weight || user.target_time_days) && (() => {
                                            const currentWeight = Number(user.weight) || 0;
                                            const targetWeight = Number(user.target_weight) || 0;
                                            const targetDays = Number(user.target_time_days) || 0;
                                            let dailyCaloriesLost = Number(user.daily_calories_lost) || 0;

                                            if (targetWeight <= 0 || targetDays <= 0) return null;

                                            const weightToLose = currentWeight - targetWeight;

                                            // Se o backend não calculou ou calculou errado, calcular aqui
                                            if (dailyCaloriesLost <= 0 && weightToLose > 0 && targetDays > 0) {
                                                const totalCaloriesNeeded = weightToLose * 7700; // 1kg = 7700 kcal
                                                dailyCaloriesLost = totalCaloriesNeeded / targetDays;
                                            }

                                            const weeksToTarget = Math.ceil(targetDays / 7);
                                            const monthsToTarget = Math.ceil(targetDays / 30);

                                            // Calcular data aproximada do objetivo
                                            const targetDate = new Date();
                                            targetDate.setDate(targetDate.getDate() + targetDays);
                                            const targetDateStr = targetDate.toLocaleDateString('pt-BR');

                                            // Calcular progresso semanal esperado
                                            const weeklyWeightLoss = weightToLose / (targetDays / 7);

                                            return (
                                                <div style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    borderRadius: '16px',
                                                    padding: '24px',
                                                    margin: '20px auto',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    color: 'white'
                                                }}>
                                                    <Typography variant="h6" style={{
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        marginBottom: '16px',
                                                        textAlign: 'center'
                                                    }}>
                                                        🎯 Seu Objetivo de Peso
                                                    </Typography>

                                                    <div className="goal-info" style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                                        gap: '16px',
                                                        width: '100%',
                                                        marginBottom: '20px'
                                                    }}>
                                                        <div style={{
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            padding: '16px',
                                                            borderRadius: '12px',
                                                            textAlign: 'center',
                                                            backdropFilter: 'blur(10px)'
                                                        }}>
                                                            <div style={{ fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>Peso Atual → Objetivo</div>
                                                            <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>
                                                                {currentWeight}kg → {targetWeight}kg
                                                            </div>
                                                            <div style={{ fontSize: '0.75em', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                                                                {weightToLose.toFixed(1)}kg para perder
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            padding: '16px',
                                                            borderRadius: '12px',
                                                            textAlign: 'center',
                                                            backdropFilter: 'blur(10px)'
                                                        }}>
                                                            <div style={{ fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>Prazo Definido</div>
                                                            <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>
                                                                {targetDays} dias
                                                            </div>
                                                            <div style={{ fontSize: '0.75em', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                                                                {weeksToTarget} semanas | {monthsToTarget} mês{monthsToTarget > 1 ? 'es' : ''}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            padding: '16px',
                                                            borderRadius: '12px',
                                                            textAlign: 'center',
                                                            backdropFilter: 'blur(10px)'
                                                        }}>
                                                            <div style={{ fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>Déficit Necessário</div>
                                                            <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>
                                                                {Math.round(dailyCaloriesLost)} kcal/dia
                                                            </div>
                                                            <div style={{ fontSize: '0.75em', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                                                                ~{weeklyWeightLoss.toFixed(2)}kg/semana
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Data objetivo */}
                                                    <div style={{
                                                        background: 'rgba(255, 255, 255, 0.15)',
                                                        padding: '12px 20px',
                                                        borderRadius: '25px',
                                                        textAlign: 'center',
                                                        marginBottom: '16px'
                                                    }}>
                                                        <strong>📅 Data Prevista: {targetDateStr}</strong>
                                                    </div>

                                                    {/* Dicas motivacionais */}
                                                    <div style={{
                                                        fontSize: '0.8em',
                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                        textAlign: 'center',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        💪 Você está {Math.round(((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)))} dias na jornada!
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Seção para quando não há objetivos definidos */}
                                        {user && !user.target_weight && !user.target_time_days && (
                                            <div style={{
                                                background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                                                borderRadius: '16px',
                                                padding: '24px',
                                                margin: '20px auto',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: 'white',
                                                textAlign: 'center'
                                            }}>
                                                <Typography variant="h6" style={{
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    marginBottom: '16px'
                                                }}>
                                                    🎯 Defina seu Objetivo de Peso
                                                </Typography>

                                                <p style={{ fontSize: '1.1em', marginBottom: '20px', lineHeight: '1.5' }}>
                                                    Quer acompanhar seu progresso de emagrecimento? <br />
                                                    Defina seu peso objetivo e prazo no seu perfil!
                                                </p>

                                                <div style={{
                                                    fontSize: '0.9em',
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    marginBottom: '20px'
                                                }}>
                                                    ✨ Com seus objetivos definidos, você verá:
                                                    <br />• Déficit calórico necessário por dia
                                                    <br />• Data prevista para atingir sua meta
                                                    <br />• Progresso esperado por semana
                                                </div>

                                                <div style={{
                                                    fontSize: '0.8em',
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    fontStyle: 'italic'
                                                }}>
                                                    👆 Clique no seu nome no topo da página e edite seu perfil
                                                </div>
                                            </div>
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