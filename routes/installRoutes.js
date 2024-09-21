const express = require('express');

const installController = require('../controllers/installController');

const router = express.Router();

router.post('/install', installController.install);

module.exports = router;