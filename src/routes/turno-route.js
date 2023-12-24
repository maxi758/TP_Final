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
  deleteTurno,
} = require('../controllers/turnos-controller');
const auth = require('../middleware/auth');
const { check, body } = require('express-validator');
const { paginateValidator, validate } = require('../utils/validators');

router.get(
  '/',
  (req, res, next) => auth(['ADMIN', 'PACIENTE'], req, res, next),
  [paginateValidator],
  getTurnos
);

router.get(
  '/:id',
  (req, res, next) => auth(['ADMIN', 'PACIENTE'], req, res, next),
  [check('id').isMongoId(), validate],
  getTurnoById
);

router.get(
  '/medicos/:id',
  (req, res, next) => auth('ADMIN', req, res, next),
  [check('id').isMongoId(), validate],
  getTurnosByMedicoId
);

router.get(
  '/pacientes/:id',
  (req, res, next) => auth(['ADMIN', 'PACIENTE'], req, res, next),
  [check('id').isMongoId(), validate],
  getTurnosByPacienteId
);

router.post(
  '/',
  (req, res, next) => auth('ADMIN', req, res, next),
  [
    check('medico').isMongoId(),
    check('paciente').isMongoId().optional(),
    check('fecha')
      .toDate()
      .custom((value, { req }) => {
        if (!value || value === '' || value === NaN) {
          throw new Error('Debe ingresar una fecha válida');
        }
        if (value < new Date()) {
          throw new Error('La fecha debe ser posterior a la fecha actual');
        }
        return true;
      }),
    check('observaciones').isLength({ min: 5 }),
    validate,
  ],
  createTurno
);

router.patch(
  '/:id',
  (req, res, next) => auth('ADMIN', req, res, next),
  [
    check('id').isMongoId(),
    check('observaciones').isLength({ min: 5 }),
    validate,
  ],
  updateTurno
);

router.patch(
  '/:id/reservar',
  (req, res, next) => auth('PACIENTE', req, res, next),
  check('id').isMongoId(),
  asignTurno
);

router.patch(
  '/:id/cancelar',
  (req, res, next) => auth('PACIENTE', req, res, next),
  check('id').isMongoId(),
  cancelTurno
);

router.get(
  '/pacientes/:id/cancelados',
  (req, res, next) => auth('PACIENTE', req, res, next),
  check('id').isMongoId(),
  cancelledTurnosByPatient
);

router.delete(
  '/:id',
  (req, res, next) => auth('ADMIN', req, res, next),
  check('id').isMongoId(),
  deleteTurno
);

module.exports = router;
