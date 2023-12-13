const HttpError = require('../models/http-error');

const Usuario = require('../models/usuario');

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

  res.json({
    usuarios: usuarios.map((usuario) => usuario.toObject({ getters: true })),
  });
};

const createUsuario = async (req, res) => {
  const usuario = new Usuario(req.body);

  try {
    await usuario.save();
    console.log(usuario);
    //sendWelcomeEmail(usuario.email, usuario.name); // send welcome email
    const token = await usuario.generateAuthToken();
    res.status(201).send({ usuario, token }); // send back user and token
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
};

const login = async (req, res) => {
  try {
    const usuario = await Usuario.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await usuario.generateAuthToken();

    res.send({ usuario, token });
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
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
