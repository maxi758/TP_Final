const express = require('express');

const router = express.Router();

const {
  getUsuarios,
  createUsuario,
  login,
} = require('../controllers/usuario-controller');
const auth = require('../middleware/auth');

router.get('/', (req, res, next) => auth('ADMIN', req, res, next) , getUsuarios);

router.post('/', createUsuario);

router.post('/login', login);

module.exports = router;
