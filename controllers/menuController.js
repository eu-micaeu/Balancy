const Menu = require('../models/Menu');

const dotenv = require('dotenv');

dotenv.config();

// Função para criar um menu
exports.createMenu = async (req, res) => {

    try {

        const { menu_name } = req.body;

        const user_id = req.user.user_id;

        const menu = await Menu.create({ menu_name, user_id });

        return res.status(201).json(menu);

    } catch (error) {

        return res.status(500).json({ error: error.message });

    }

};

exports.addFoodToMenu = async (req, res) => {
    try {

        const { food_name, food_calories, food_quantity } = req.body.food; // Desestruture o corpo da solicitação para obter os dados do alimento

        const menu_id = req.body.menu_id; // Obtenha o ID do menu do corpo da solicitação

        const menu = await Menu.findByPk(menu_id);

        if (!menu) {
            return res.status(404).json({ error: 'Menu não encontrado!' });
        }

        let menu_foods = menu.menu_foods || []; // Obtenha os alimentos do menu ou um array vazio

        const food = { food_name, food_calories, food_quantity };

        menu_foods = [...menu_foods, food];


        const menu_calories = menu.menu_calories + (food_calories * (food_quantity / 100));

        await Menu.update({ menu_foods, menu_calories }, { where: { menu_id } });

        return res.status(200).json({ message: 'Alimento adicionado com sucesso!' });

    } catch (error) {

        return res.status(500).json({ error: 'Erro ao adicionar o alimento ao menu' });

    }

};

exports.deleteFoodFromMenu = async (req, res) => {

    try {

        const food_name = req.body.food_name;

        const menu_id = req.body.menu_id;

        const menu = await Menu.findByPk(menu_id);

        if (!menu) {
            return res.status(404).json({ error: 'Menu não encontrado!' });
        }

        let menu_foods = menu.menu_foods || [];

        const foodIndex = menu_foods.findIndex(food => food.food_name === food_name);

        if (foodIndex === -1) {
            return res.status(404).json({ error: 'Alimento não encontrado!' });
        }

        const food = menu_foods[foodIndex];

        menu_foods.splice(foodIndex, 1);

        const menu_calories = menu.menu_calories - (food.food_calories * (food.food_quantity / 100));

        await Menu.update({ menu_foods, menu_calories }, { where: { menu_id } });

        return res.status(200).json({ message: 'Alimento removido com sucesso!' });

    } catch (error) {

        return res.status(500).json({ error: 'Erro ao remover o alimento do menu' });

    }

}