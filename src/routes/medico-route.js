const express = require('express');

const router = express.Router();

const {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico
} = require('../controllers/medicos-controller');
const auth = require('../middleware/auth');
const { check, body } = require('express-validator');
const { paginateValidator, validate } = require('../utils/validators');

router.get('/', [paginateValidator], getMedicos);

router.get('/:id', [check('id').isMongoId(), validate], getMedicoById);

router.post(
  '/',
  (req, res, next) => auth('ADMIN', req, res, next),
  [
    check('nombre').isLength({ min: 2 }),
    check('apellido').isLength({ min: 2 }),
    check('matricula').isInt({ min: 1 }),
    check('especialidad').isMongoId(),
    validate,
  ],
  createMedico
);

router.patch(
  '/:id',
  (req, res, next) => auth('ADMIN', req, res, next),
  [
    check('id').isMongoId(),
    check('nombre').isLength({ min: 2 }).optional(),
    check('apellido').isLength({ min: 2 }).optional(),
    check('matricula').isInt({ min: 1 }).optional(),
    check('especialidad').isMongoId().optional(),
    body().custom((value, { req }) => {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Request body is empty");
      }
      return true;
    }),
    validate,
  ], 
  updateMedico
);

router.delete(
  '/:id',
  (req, res, next) => auth('ADMIN', req, res, next),
  [check('id').isMongoId(), validate],
  deleteMedico
);

module.exports = router;
