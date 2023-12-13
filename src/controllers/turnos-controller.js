const HttpError = require('../models/http-error');

const Turno = require('../models/turno');

const getTurnos = async (req, res, next) => {
  let turnos;
  try {
    turnos = await Turno.find();
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!turnos || turnos.length === 0) {
    return next(new HttpError('No se encontraron turnos', 404));
  }

  res.json({
    turnos: turnos.map((turno) => turno.toObject({ getters: true })),
  });
};

const getTurnoById = async (req, res, next) => {};

const getTurnosByMedicoId = async (req, res, next) => {};

const getTurnosByPacienteId = async (req, res, next) => {};

// Debería poder ser creado sin paciente asignado o con paciente asignado, eso varía el estado
const createTurno = async (req, res, next) => {
  const turno = new Turno({
    ...req.body,
  });

  try {
    await turno.save();
  } catch (err) {
    const error = new HttpError(
      'No se pudo crear el turno, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  res.status(201).json({ turno: turno.toObject({ getters: true }) });
};

// Cambia el estado del turno, puede ser 
const updateTurno = async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.body;
  let turno;
  try {
    turno = await Turno.findById(id);
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!turno) {
    return next(new HttpError('No se encontró un turno para el id dado', 404));
  }

  turno.estado = estado;

  try {
    await turno.save();
  } catch (err) {
    const error = new HttpError(
      'No se pudo actualizar el turno, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  res.status(200).json({ turno: turno.toObject({ getters: true }) });
};

// Podría implementar cascada
const deleteTurno = async (req, res, next) => {
    const { id } = req.params;
    let turno;
    try {
        turno = await Turno.findByIdAndDelete(id);
    } catch (err) {
        const error = new HttpError(
        'Error en la consulta, intente de nuevo más tarde',
        500
        );
    }   
    res.status(200).json({ message: 'Turno eliminado' });
};

module.exports = {
  getTurnos,
  getTurnoById,
  getTurnosByMedicoId,
  getTurnosByPacienteId,
  createTurno,
  updateTurno,
  deleteTurno,
};
