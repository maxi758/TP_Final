const { validationResult, body } = require('express-validator');
const HttpError = require('../models/http-error');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new HttpError(
        errors.array()[0].msg ||
        "Los datos ingresados no son válidos, verifique e intente nuevamente",
        422
      );
      return next(error);
    }
    next();
  };
  
  const paginateValidator = (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    if (isNaN(page) || isNaN(limit)) {
      const error = new HttpError("Los datos ingresados no son válidos, limit y page deben tener valores numéricos", 422);
      return next(error);
    }
    next();
  };

const validateBodyKeys = (body, validKeys) => {
  return body().custom(body => {
    const keys = Object.keys(body);
    return keys.every(key => validKeys.includes(key));
  });
}

  
  module.exports = {validate, paginateValidator, validateBodyKeys};