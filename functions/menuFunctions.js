const Menu = require("../models/Menu");

// Função para listar todos os menus de um usuário
async function listMenus(user_id){

    try {

        const menus = await Menu.findAll({ where: { user_id } });

        return menus;

    } catch (error) {

        return res.status(500).json({ error: error.message });

    }

};

module.exports = { listMenus };