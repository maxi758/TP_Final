const express = require('express');

const router = express.Router();

const {
    getTurnos,
    getTurnoById,
    getTurnosByMedicoId,
    getTurnosByPacienteId,
    createTurno,
    updateTurno,
    asignTurno,
    cancelTurno,
    cancelledTurnosByPatient,
    deleteTurno
    } = require('../controllers/turnos-controller');
const auth = require('../middleware/auth');

router.get('/', getTurnos);

router.get('/:id', getTurnoById);

router.get('/medicos/:id', (req, res, next) => auth('ADMIN', req, res, next), getTurnosByMedicoId);

router.get('/pacientes/:id', getTurnosByPacienteId);

router.post('/', (req, res, next) => auth('ADMIN', req, res, next) ,createTurno);

router.patch('/:id', (req, res, next) => auth('ADMIN', req, res, next), updateTurno);

router.patch('/:id/reservar', (req, res, next) => auth('PACIENTE', req, res, next), asignTurno);

router.patch('/:id/cancelar', (req, res, next) => auth('PACIENTE', req, res, next), cancelTurno);

router.get('/pacientes/:id/cancelados', (req, res, next) => auth('PACIENTE', req, res, next), cancelledTurnosByPatient);

router.delete('/:id', (req, res, next) => auth('ADMIN', req, res, next), deleteTurno);

module.exports = router;