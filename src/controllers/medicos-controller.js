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

const getMedicoById = async (req, res, next) => {
  const { id } = req.params;
  let medico;
  try {
    medico = await Medico.findById(id);
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
  }

  if (!medico) {
    return next(new HttpError('No se encontró un médico para el id dado', 404));
  }

  res.json({ medico });
};
//Admin
const createMedico = async (req, res, next) => {
  const medico = new Medico({
    ...req.body,
  });

  try {
    await medico.save();
  } catch (err) {
    const error = new HttpError(
      'No se pudo crear el médico, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  res.status(201).json({ medico: medico.toObject({ getters: true }) });
};

//Admin

const updateMedico = async (req, res, next) => {
  const { id } = req.params;
  const propertiesToUpdate = req.body;
  let medico;
  try {
    medico = Medico.findByIdAndUpdate(id, propertiesToUpdate, { new: true });
  } catch (err) {
    const error = new HttpError(
      'No se pudieron actualizar los datos del médico, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!medico) {
    return next(new HttpError('No se encontró un médico para el id dado', 404));
  }
  res.json({ medico });
};

module.exports = {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
};
