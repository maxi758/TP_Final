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

router.get('/', getTurnos);

router.get('/:id', getTurnoById);

router.get('/medicos/:id', getTurnosByMedicoId);

router.post('/', createTurno);

router.patch('/:id', updateTurno);

router.delete('/:id', deleteTurno);

module.exports = router;