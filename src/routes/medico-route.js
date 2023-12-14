const express = require('express');

const router = express.Router();

const {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
} = require('../controllers/medicos-controller');
const auth = require('../middleware/auth');

router.get('/', getMedicos);

router.get('/:id', getMedicoById);

router.post('/', (req, res, next) => auth('ADMIN', req, res, next) ,createMedico);

router.patch('/:id', (req, res, next) => auth('ADMIN', req, res, next), updateMedico);

module.exports = router;
