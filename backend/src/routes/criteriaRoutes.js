const express = require('express');
const router = express.Router();
const CriteriaController = require('../controllers/criteriaController');

router.get('/', CriteriaController.getAll);
router.post('/', CriteriaController.create);
router.put('/:id', CriteriaController.update);
router.delete('/:id', CriteriaController.delete);

module.exports = router;
