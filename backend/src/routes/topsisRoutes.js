const express = require('express');
const router = express.Router();
const TopsisController = require('../controllers/topsisController');

router.post('/calculate', TopsisController.calculate);

module.exports = router;
