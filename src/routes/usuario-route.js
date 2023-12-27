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
const {
  paginateValidator,
  validate,
  validateBodyKeys,
} = require('../utils/validators');

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
    check('apellido').isLength({ min: 2 }),
    check('dni').isLength({ min: 7, max: 8 }),
    check('email', 'El formato de mail no es válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    validateBodyKeys(body,['nombre', 'apellido', 'dni', 'email', 'password']),
    validate,
    (req, res, next) => {
      req.body.rol = 'PACIENTE'; // setear el rol del usuario
      next();
    },
  ],
  createUsuario
);

router.post(
  '/admin',
  (req, res, next) => auth('ADMIN', req, res, next), // solo un admin puede crear un usuario admin
  [
    check('nombre').isLength({ min: 2 }),
    check('apellido').isLength({ min: 2 }),
    check('dni').isLength({ min: 7, max: 8 }),
    check('email', 'El formato de mail no es válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    //check('rol').isIn(['ADMIN', 'PACIENTE']),
    (req, res, next) => {
      req.body.rol = 'ADMIN'; // setear el rol del usuario
      next();
    },
    validateBodyKeys(body,['nombre', 'apellido', 'dni', 'email', 'password', 'rol']),
    validate,
  ],
  createUsuario
);

router.post(
  '/login',
  [
    check('email', 'El formato de email no es válido').isEmail(),
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
  (req, res, next) => auth(['ADMIN','PACIENTE'], req, res, next),
  logout
);

router.post(
  '/logoutAll',
  (req, res, next) => auth(['ADMIN','PACIENTE'], req, res, next),
  logoutAll
);

router.post(
  '/email',
  [check('email', 'El formato de email no es válido').isEmail(), validate],
  recoverPassword
);

router.patch(
  '/reset-password',
  /*(req, res, next) => auth('PACIENTE', req, res, next),*/
  [
    check('email', 'El formato de email no es válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    check(
      'repeatPassword',
      'La contraseña debe tener entre 4 y 8 caracteres'
    ).isLength({ min: 4, max: 8 }),
    check('key').isJWT(),
    validate,
  ],
  resetPassword
);

module.exports = router;
