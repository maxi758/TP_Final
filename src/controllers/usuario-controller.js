const HttpError = require('../models/http-error');
const Usuario = require('../models/usuario');
const sendEmail = require('../services/email');
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
  const { email } = req.body;

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

  const usuario = new Usuario({ ...req.body });

  console.log(usuario);
  try {
    await usuario.save();
    //sendWelcomeEmail(usuario.email, usuario.name); // send welcome email
    //const token = await usuario.generateAuthToken();
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
  } catch (error) {
    res.status(500).send(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    req.usuario.tokens.splice(0, req.usuario.tokens.length);
    await req.usuario.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const recoverPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    const token = await usuario.generateAuthToken();
    await sendEmail(
      email,
      'Recuperación de contraseña',
      `Hola, para recuperar tu contraseña ingresa al siguiente link: ${process.env.BACKEND_URL_USER}/reset-password
      Token:${token}`
    );
    res.send('Se ha enviado un mail con las instrucciones para recuperar la contraseña');
  } catch (error) {
    res.status(500).send(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password, repeatPassword } = req.body;
  if (password !== repeatPassword) {
    return res.status(400).send('Las contraseñas no coinciden');
  }
  try {
    const usuario = await Usuario.findOne({ email });
    usuario.password = password;
    await usuario.save();
    res.send('Contraseña actualizada exitosamente');
  } catch (error) {
    res.status(500).send(error);
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
