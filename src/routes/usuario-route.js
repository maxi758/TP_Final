const express = require('express');

const router = express.Router();

const {
  getUsuarios,
  createUsuario,
  login,
} = require('../controllers/usuario-controller');
const auth = require('../middleware/auth');
const { check, body } = require('express-validator');
const { paginateValidator, validate } = require('../utils/validators');

router.get(
  '/',
  (req, res, next) => auth('ADMIN', req, res, next),
  [paginateValidator],
  getUsuarios
);

router.post(
  '/',
  [
    check('nombre').isLength({ min: 2 }),
    check('apellido'),
    check('dni'),
    check('email').isEmail(),
    check('password'),
    validate,
  ],
  createUsuario
);

router.post(
  '/login',
  [check('email').isEmail(), check('password'), validate],
  login
);

module.exports = router;
