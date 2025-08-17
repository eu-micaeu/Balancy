import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, MenuItem, Button } from '@mui/material';
import '../PopUps.css';
import { getAuthTokenFromCookies } from '../../../utils/cookies';


export default function PopUpAdicionarAlimento({ open, handleClose, fetchMenu, meals, selectedMealId = null }) {
    const [newFood, setNewFood] = useState({
        mealId: selectedMealId || '',
        foodName: '',
        calories: '',
        quantity: '100' // padrão 100g, editável pelo usuário
    });

    // Quando o popup abrir ou o selectedMealId mudar, atualiza o estado do mealId
    useEffect(() => {
        if (selectedMealId) {
            setNewFood((prev) => ({ ...prev, mealId: selectedMealId }));
        } else {
            setNewFood((prev) => ({ ...prev, mealId: '' }));
        }
    }, [selectedMealId, open]);

    // Campos e criação de alimento manual
    const createFood = async () => {
        try {
            const baseApi = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const payload = {
                meal_id: parseInt(newFood.mealId),
                food_name: newFood.foodName,
                calories: parseInt(newFood.calories),
                quantity: parseInt(newFood.quantity),
                source: 'manual',
            };
            console.log('createFood payload:', payload);
            const token = getAuthTokenFromCookies();
            if (!token) {
                console.error('No auth token present');
                alert('Usuário não autenticado. Faça login e tente novamente.');
                return;
            }

            const response = await fetch(`${baseApi}/createFood`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // try to read response body for more details
                let details = '';
                try {
                    const json = await response.json();
                    details = JSON.stringify(json);
                } catch (e) {
                    details = await response.text();
                }
                throw new Error(`Erro da API: ${response.statusText} - ${details}`);
            }

            // Limpa o popup
            setNewFood({ mealId: '', foodName: '', calories: '', quantity: '100' });
            await fetchMenu();
            handleClose();
        } catch (error) {
            console.error('Erro ao criar alimento:', error);
            alert('Erro ao adicionar o alimento. Tente novamente.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="popup-container">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createFood();
                    }}
                >
                    {/* Campo para preenchimento manual do nome do alimento */}
                    <TextField
                        label="Nome do Alimento"
                        value={newFood.foodName}
                        onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                        fullWidth
                        required
                        style={{ marginBottom: 12 }}
                    />

                    <TextField
                        type="number"
                        label="Quantidade (g/ml)"
                        value={newFood.quantity}
                        onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}
                    />

                    <TextField
                        type="number"
                        label="Calorias (kcal)"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Adicionar alimento
                    </Button>
                </form>
            </Box>
        </Modal>
    );

}