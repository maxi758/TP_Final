const express = require('express');

const router = express.Router();

const {
  getEspecialidades,
  createEspecialidad,
} = require('../controllers/especialidad-controller');
const { check, body } = require('express-validator');
const { validate, paginateValidator } = require('../utils/validators');
const auth = require('../middleware/auth');

router.get(
  '/',
  (req, res, next) => auth(['ADMIN', 'PACIENTE'], req, res, next),
  [paginateValidator],
  getEspecialidades
);

router.post(
  '/',
  (req, res, next) => auth(['ADMIN'], req, res, next),
  [
    check('nombre').isLength({ min: 2 }),
    check('descripcion').isLength({ min: 5 }),
    validate,
  ],
  createEspecialidad
);

module.exports = router;
