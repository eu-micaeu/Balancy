import React, { useState } from 'react';
import { Modal, Box, TextField, MenuItem, Button } from '@mui/material';
import './PopUpAdicionarAlimento.css';
import { getAuthTokenFromCookies } from '../../utils/cookies';

export default function PopUpAdicionarAlimento({ open, handleClose, fetchMenu, meals }) {
    const [newFood, setNewFood] = useState({
        mealId: '',
        foodName: '',
        calories: '',
        quantity: ''
    });

    const createFood = async () => {
        try {
            const response = await fetch('http://localhost:8080/createFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthTokenFromCookies()}`
                },
                body: JSON.stringify({
                    meal_id: parseInt(newFood.mealId),
                    food_name: newFood.foodName,
                    calories: parseInt(newFood.calories),
                    quantity: parseInt(newFood.quantity),
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro da API: ${response.statusText}`);
            }

            // Limpando o popup

            newFood.mealId = '';
            newFood.foodName = '';
            newFood.calories = '';
            newFood.quantity = '';

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
                <h2>Adicionar Alimento</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createFood();
                    }}
                >
                    <TextField

                        select
                        label="Refeição"
                        value={newFood.mealId}
                        onChange={(e) =>
                            setNewFood({ ...newFood, mealId: e.target.value })
                        }
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}
                    >
                        {meals.map((meal) => (
                            <MenuItem key={meal.meal_id} value={meal.meal_id}>
                                {meal.meal_name}
                            </MenuItem>
                        ))}

                    </TextField>


                    <TextField

                        label="Nome do Alimento"
                        value={newFood.foodName}
                        onChange={(e) =>
                            setNewFood({ ...newFood, foodName: e.target.value })
                        }
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}

                    />

                    <TextField

                        type="number"
                        label="Quantidade (g/ml)"
                        value={newFood.quantity}
                        onChange={(e) =>
                            setNewFood({ ...newFood, quantity: e.target.value })
                        }
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}

                    />

                    <TextField

                        type="number"
                        label="Calorias (kcal)"
                        value={newFood.calories}
                        onChange={(e) =>
                            setNewFood({ ...newFood, calories: e.target.value })
                        }
                        fullWidth
                        required
                        style={{ marginBottom: 20 }}

                    />

                    <Button type="submit" variant="contained" color="primary">

                        Adicionar

                    </Button>

                </form>

            </Box>

        </Modal>

    );

}