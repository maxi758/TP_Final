const express = require('express');

const router = express.Router();

const {
  getUsuarios,
  createUsuario,
  login,
} = require('../controllers/usuario-controller');
const sendEmail = require('../services/email');
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

/*router.post('/logout', auth(), async (req, res) => {
  try {
    req.usuario.tokens = req.usuario.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.usuario.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/logoutall', auth(), async (req, res) => {
  try {
    req.usuario.tokens.splice(0, req.usuario.tokens.length);
    await req.usuario.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
router.post('/email', async (req, res) => {
  try {
    await sendEmail(
      'maxi-758@hotmail.com',
      'Bienvenido a la aplicación de turnos',
      'Gracias por registrarte'
    );
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
