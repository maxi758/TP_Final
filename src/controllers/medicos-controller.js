const especialidad = require('../models/especialidad');
const HttpError = require('../models/http-error');

const Medico = require('../models/medico');

const getMedicos = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  let medicos;
  try {
    medicos = await Medico.find()
      .populate(['turnos', 'especialidad'])
      .limit(limit * 1)
      .skip((page - 1) * limit);
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
    medico = await Medico.findById(id).populate({path: 'turnos', match: {estado: 'DISPONIBLE'}});
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
  console.log(req.body);
  const medico = new Medico({
    ...req.body,
  });
  console.log(medico);
  try {
    const existingEspecialidad = await especialidad.findById(
      medico.especialidad
    );

    if (!existingEspecialidad) {
      const error = new HttpError('No existe la especialidad ingresada', 422);
      return next(error);
    }
    if (await Medico.findOne({ matricula: medico.matricula })) {
      const error = new HttpError(
        'Ya existe un médico con la matrícula ingresada',
        422
      );
      return next(error);
    }

    const session = await Medico.startSession(); // Transaccion
    session.startTransaction();
    existingEspecialidad.medicos.push(medico);
    await existingEspecialidad.save();
    await medico.save();
    await session.commitTransaction();
    session.endSession();
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
  console.log(propertiesToUpdate);

  try {
    if (propertiesToUpdate.especialidad) {
      const existingEspecialidad = await especialidad.findById(
        propertiesToUpdate.especialidad
      );
      if (!existingEspecialidad) {
        const error = new HttpError('No existe la especialidad ingresada', 422);
        return next(error);
      }
    }

    medico = await Medico.findByIdAndUpdate(id, propertiesToUpdate, {
      new: true,
    });
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
