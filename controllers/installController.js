const sequalize = require('../config/database');

const User = require('../models/User');

const Menu = require('../models/Menu');

exports.install = async (req, res) => {

    try {

        await sequalize.sync({ force: true });

        await User.bulkCreate([

            { username: 'micael', password: '12345678', height: 1.8, weight: 120.0, gender: 'M', age: 20, activityLevel: "sedentary" },

            { username: 'brena', password: '09876543', height: 1.64, weight: 61.3, gender: 'F', age: 20, activityLevel: "light" },


        ]);             
        
        await Menu.bulkCreate([

            { user_id: 1, menu_name: 'Emagrecimento' },

            { user_id: 2, menu_name: 'Ganha de Massa' },

        ]);

        res.status(201).json({ message: 'Banco de dados criado!' });

    } catch (error) {

        console.error('Erro:', error);

        res.status(500).json({ error: error.message });

    }

};