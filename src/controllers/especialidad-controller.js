const HttpError = require('../models/http-error');

const Especialidad = require('../models/especialidad');

const getEspecialidades = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  let especialidades;
  try {
    especialidades = await Especialidad.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!especialidades || especialidades.length === 0) {
    return next(new HttpError('No se encontraron especialidades', 404));
  }

  res.json({
    especialidades: especialidades.map((especialidad) =>
      especialidad.toObject({ getters: true })
    ),
  });
};

const createEspecialidad = async (req, res, next) => {
  const especialidad = new Especialidad({
    ...req.body,
  });

  try {
    await especialidad.save();
  } catch (err) {
    const error = new HttpError(
      'No se pudo crear la especialidad, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ especialidad: especialidad.toObject({ getters: true }) });
};

module.exports = {
  getEspecialidades,
  createEspecialidad,
};
