const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const HttpError = require('../models/http-error');

const auth = async (roles, req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return next(new HttpError('Token faltante', 401));
    }

    console.log(roles);
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

    // Para que roles pueda ser un string o un array (si es un string, lo convierte en un array). 
    // De esta forma, si se pasa un solo rol, no hay que pasar un array con un solo elemento
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(usuario.rol)) {
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
