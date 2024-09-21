const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')

// User Functions
const { calculateDailyCalories } = require('../functions/userFunctions');
const { calculateIMC } = require('../functions/userFunctions');

// Menu Functions
const { listMenus } = require('../functions/menuFunctions');

// Páginas
router.get("/", (req, res) => {

    res.render("index")

})

router.get("/home", authenticate, async (req, res) => {

    try {

        const imc = calculateIMC(req.user);

        const dailyCalories = calculateDailyCalories(req.user);

        const menus = await listMenus(req.user.user_id);

        res.cookie('menu_id', menus[0].menu_id);

        res.render("home", { menus: menus, dailyCalories: dailyCalories, imc: imc, activyLevelUser: req.user.activityLevel});

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: error.message });

    }

});

router.get("/perfil", authenticate, (req, res) => {

    res.render("perfil", { user: req.user });

})

module.exports = router