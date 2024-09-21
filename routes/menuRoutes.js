const express = require('express');

const menuController = require('../controllers/menuController');

const router = express.Router();

const authenticate = require('../middlewares/authenticate');

router.post('/createMenu', authenticate, menuController.createMenu);

// Bussiness rules

router.post('/addFoodToMenu', authenticate, menuController.addFoodToMenu);

router.delete('/deleteFoodFromMenu', authenticate, menuController.deleteFoodFromMenu);

module.exports = router;