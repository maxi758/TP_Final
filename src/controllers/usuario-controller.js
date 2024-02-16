const HttpError = require('../models/http-error');
const Usuario = require('../models/usuario');
const sendEmail = require('../services/email');
const jwt = require('jsonwebtoken');
const util = require('util');
const jwtVerify = util.promisify(jwt.verify);
const { Rol } = require('../utils/constantes');

const getUsuarios = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  let usuarios;
  try {
    usuarios = await Usuario.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!usuarios || usuarios.length === 0) {
    return next(new HttpError('No se encontraron usuarios', 404));
  }

  res.json({ usuarios });
};

const createUsuario = async (req, res, next) => {
  const { email, nombre, apellido, dni, password, rol } = req.body;

  let existingUsuario;

  try {
    existingUsuario = await Usuario.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (existingUsuario) {
    const error = new HttpError(
      'El email ingresado ya se encuentra registrado en el sistema',
      422
    );
    return next(error);
  }

  const usuario = new Usuario({ email, nombre, apellido, dni, password, rol });

  console.log(usuario);
  try {
    await usuario.save();
    res.status(201).json({ usuario });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await usuario.generateAuthToken();

    res.send({ usuario, token });
  } catch (err) {
    const error = new HttpError(
      err.message || 'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.usuario.tokens = req.usuario.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.usuario.save();
    res.send('Ha cerrado la sesión exitosamente');
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    req.usuario.tokens.splice(0, req.usuario.tokens.length);
    await req.usuario.save();
    res.send();
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .send('No se encontró un usuario con el email ingresado');
    }
    usuario.tokens = [];
    const token = await usuario.generateAuthToken();
    await sendEmail(
      email,
      'Recuperación de contraseña',
      `Hola, para recuperar tu contraseña ingresa al siguiente link: ${process.env.FRONTEND_URL}/auth/recover-password?key=${token} \n`
    );
    res.json({
      message:
        'Se ha enviado un mail con las instrucciones para recuperar la contraseña',
    });
  } catch (err) {
    const error = new HttpError(
      'No se pudo enviar el mail, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password, repeatPassword, key } = req.body;
  try {
    await jwtVerify(key, 'mysecret');
  } catch (err) {
    const error = new HttpError('El token ingresado no es válido', 500);
    return next(error);
  }

  if (password !== repeatPassword) {
    return res.status(400).send('Las contraseñas no coinciden');
  }

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .send('No se encontró un usuario con el email ingresado');
    }
    if (!usuario.tokens || usuario.tokens.length === 0) {
      return res.status(400).send('No se encontró un token');
    }
    if (usuario.tokens[0].token !== key) {
      return res.status(400).send('El token ingresado no es válido');
    }
    usuario.password = password;
    await usuario.save();
    res.json({ message: 'Se ha actualizado la contraseña exitosamente' });
  } catch (err) {
    const error = new HttpError(
      'No se pudo actualizar la contraseña, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  login,
  logout,
  logoutAll,
  recoverPassword,
  resetPassword,
};
