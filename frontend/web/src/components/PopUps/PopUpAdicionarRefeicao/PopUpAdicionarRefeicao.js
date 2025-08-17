import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../PopUps.css';
import { getAuthTokenFromCookies } from '../../../utils/cookies';

export default function PopUpAdicionarRefeicao({ open, handleClose, fetchMenu, meals }) {
    const [newMeal, setNewMeal] = useState({
        menuId: '',
        mealName: '',
    });

    const createMeal = async () => {
        try {
            const baseApi = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const response = await fetch(`${baseApi}/createMeal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthTokenFromCookies()}`
                },
                body: JSON.stringify({
                    menu_id: parseInt(newMeal.menuId),
                    meal_name: newMeal.mealName
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro da API: ${response.statusText}`);
            }

            // Limpando o popup

            newMeal.menuId = '';
            newMeal.mealName = '';

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
                <h2>Adicionar Refeição</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createMeal();
                    }}
                >

                    <TextField

                        label="Nome da Refeicão"
                        value={newMeal.mealName}
                        onChange={(e) =>
                            setNewMeal({ ...newMeal, mealName: e.target.value })
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