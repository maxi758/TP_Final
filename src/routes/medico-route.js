const express = require('express');

const router = express.Router();

const {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
} = require('../controllers/medicos-controller');

router.get('/', getMedicos);

router.get('/:id', getMedicoById);

router.post('/', createMedico);

router.patch('/:id', updateMedico);

module.exports = router;
