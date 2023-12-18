const express = require('express');

const router = express.Router();

const {
  getEspecialidades,
  createEspecialidad,
} = require('../controllers/especialidad-controller');
const { check, body } = require('express-validator');
const { validate, paginateValidator } = require('../utils/validators');

router.get('/', [paginateValidator], getEspecialidades);

router.post(
  '/',
  [
    check('nombre').isLength({ min: 2 }),
    check('descripcion').isLength({ min: 5 }),
    validate,
  ],
  createEspecialidad
);

module.exports = router;
