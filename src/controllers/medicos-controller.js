const HttpError = require('../models/http-error');

const Medico = require('../models/medico');

const getMedicos = async (req, res, next) => {
  let medicos;
  try {
    medicos = await Medico.find().populate('especialidad');
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!medicos || medicos.length === 0) {
    return next(new HttpError('No se encontraron médicos', 404));
  }

  res.json({
    medicos: medicos.map((medico) => medico.toObject({ getters: true })),
  });
};
