const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const HttpError = require('../models/http-error');

const auth = async (rol, req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return next(new HttpError('Token faltante', 401));
    }

    console.log(rol);
    console.log(req.header('Authorization'));
    const token = req.header('Authorization').replace('Bearer ', ''); // remove 'Bearer ' from token string
    const decoded = jwt.verify(token, 'mysecret'); // decode token
    const usuario = await Usuario.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!usuario) {
      return next(new HttpError('Inicie sesión', 401));
    }
    req.token = token; // store token on request object
    req.usuario = usuario; // store user on request object

    console.log(usuario.rol);

    if (rol !== usuario.rol && usuario.rol !== 'ADMIN') {
      return next(
        new HttpError('No tiene permisos para realizar esta acción', 403)
      );
    }
    next();
  } catch (e) {
    console.log(e.message);
    return next(new HttpError('Error de autenticación', 401));
  }
};

module.exports = auth;
