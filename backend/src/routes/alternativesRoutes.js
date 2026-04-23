const express = require('express');
const router = express.Router();
const AlternativesController = require('../controllers/alternativesController');

router.get('/', AlternativesController.getAll);
router.post('/', AlternativesController.create);
router.put('/:id', AlternativesController.update);
router.delete('/:id', AlternativesController.delete);

module.exports = router;
