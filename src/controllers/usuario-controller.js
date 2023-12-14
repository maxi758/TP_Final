const HttpError = require('../models/http-error');
const Usuario = require('../models/usuario');
const { Rol } = require('../utils/constantes');

const getUsuarios = async (req, res, next) => {
  let usuarios;
  try {
    usuarios = await Usuario.find();
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

module.exports = {
  getUsuarios,
  createUsuario,
  login,
};
