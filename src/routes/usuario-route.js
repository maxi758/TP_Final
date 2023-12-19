const express = require('express');

const router = express.Router();

const {
  getUsuarios,
  createUsuario,
  login,
  logout,
  logoutAll,
  recoverPassword,
  resetPassword,
} = require('../controllers/usuario-controller');

const auth = require('../middleware/auth');
const { check, body } = require('express-validator');
const { paginateValidator, validate } = require('../utils/validators');
const { log } = require('make');

router.get(
  '/',
  /*(req, res, next) => auth('ADMIN', req, res, next),*/
  [paginateValidator],
  getUsuarios
);

router.post(
  '/',
  [
    check('nombre').isLength({ min: 2 }),
    check('apellido').isLength({ min: 2 }),
    check('dni').isLength({ min: 7, max: 8 }),
    check('email', 'El formato de mail no es válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    validate,
  ],
  createUsuario
);

router.post(
  '/login',
  [
    check('email', 'El formato de mail no es válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    validate,
  ],
  login
);

router.post(
  '/logout',
  (req, res, next) => auth('PACIENTE', req, res, next),
  logout
);

router.post(
  '/logoutAll',
  (req, res, next) => auth('PACIENTE', req, res, next),
  logoutAll
);

router.post('/email', recoverPassword);

router.post(
  '/reset-password',
  (req, res, next) => auth('PACIENTE', req, res, next),
  resetPassword
);

module.exports = router;
