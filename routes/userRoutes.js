const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

const authenticate = require('../middlewares/authenticate');

router.post('/updateUser/:id', authenticate, userController.updateUser);

router.delete('/deleteUser/:id', authenticate, userController.deleteUser);

// Authentication routes

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', authenticate, userController.logoutUser);

module.exports = router;