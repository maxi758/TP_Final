const express = require('express');

const router = express.Router();

const {
  getUsuarios,
  createUsuario,
  login,
} = require('../controllers/usuario-controller');

router.get('/', getUsuarios);

router.post('/', createUsuario);

router.post('/login', login);

module.exports = router;
