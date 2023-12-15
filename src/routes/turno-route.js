const express = require('express');

const router = express.Router();

const {
    getTurnos,
    getTurnoById,
    getTurnosByMedicoId,
    createTurno,
    updateTurno,
    deleteTurno
    } = require('../controllers/turnos-controller');
const auth = require('../middleware/auth');

router.get('/', getTurnos);

router.get('/:id', getTurnoById);

router.get('/medicos/:id', (req, res, next) => auth('ADMIN', res, req, next), getTurnosByMedicoId);

router.post('/', (req, res, next) => auth('ADMIN', res, req, next) ,createTurno);

router.patch('/:id', (req, res, next) => auth('ADMIN', res, req, next), updateTurno);

router.delete('/:id', (req, res, next) => auth('ADMIN', res, req, next), deleteTurno);

module.exports = router;