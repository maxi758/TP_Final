const HttpError = require('../models/http-error');
const { EstadoTurno } = require('../utils/constantes');

const Turno = require('../models/turno');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

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

const getTurnosByMedicoId = async (req, res, next) => {
  const { id } = req.params;
  let turnos;
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      const error = new HttpError(
        'No existe un medico con el id ingresado',
        422
      );
      return next(error);
    }
    turnos = await Turno.find({ medico: id });
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
  res.json({ turnos });
};

const getTurnosByPacienteId = async (req, res, next) => {
  const { id } = req.params;
  let turnos;
  try {
    const paciente = await Usuario.findById(id);
    if (!paciente) {
      const error = new HttpError(
        'No existe un medico con el id ingresado',
        422
      );
      return next(error);
    }
    turnos = await Turno.find({ usuario: id });
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }
  res.json({ turnos });
};

// Debería poder ser creado sin paciente asignado o con paciente asignado, eso varía el estado
const createTurno = async (req, res, next) => {
  const { fecha, medico, observaciones } = req.body;
  let estado, usuario, medicoFound;
  try {
    medicoFound = await Medico.findById(medico);
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  if (!medicoFound) {
    const error = new HttpError('No existe un medico con el id ingresado', 422);
    return next(error);
  }

  if (req.body.paciente) {
    try {
      console.log(req.body.paciente);
      usuario = await Usuario.findById(req.body.paciente);
    } catch (err) {
      const error = new HttpError(
        'Error en la consulta, intente de nuevo más tarde',
        500
      );
      return next(error);
    }
    if (!usuario) {
      const error = new HttpError(
        'No existe un usuario con el id ingresado',
        422
      );
      return next(error);
    }
    estado = EstadoTurno.ASIGNADO;
  } else {
    estado = EstadoTurno.DISPONIBLE;
  }

  const turno = new Turno({
    fecha,
    medico,
    usuario: req.body.paciente,
    observaciones,
    estado,
  });

  try {
    await turno.save();
  } catch (err) {
    console.log(err);
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

const asignTurno = async (req, res, next) => {
  const { tid, pid } = req.params;

  let turno, paciente;
  try {
    turno = await Turno.findById(tid);
    paciente = await Usuario.findById(pid);
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

  if (!paciente) {
    return next(new HttpError('No se encontró un paciente para el id dado', 404));
  }

  turno.usuario = paciente;
  turno.estado = EstadoTurno.ASIGNADO;

  try {  
    await turno.save();  
  } catch (err) {
    const error = new HttpError(
      'No se pudo actualizar el turno, intente de nuevo más tarde',
      500
    );
    return next(error);
  }

  res.status(200).json({ turno });
}

const cancelTurno = async (req, res, next) => {
  const { id } = req.params;
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

  if (!turno.usuario.equals(req.usuario._id) && req.usuario.rol !== 'ADMIN') {
    const error = new HttpError(
      'No tiene permisos para cancelar este turno',
      403
    );
    return next(error);
  }

  turno.estado = EstadoTurno.CANCELADO;

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

const cancelledTurnosByPatient = async (req, res, next) => {
  const { id } = req.params;
  let turnos;
  try {
    turnos = await Turno.find({ usuario: id, estado: EstadoTurno.CANCELADO });
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
  }
  if (turnos.length === 0) {
    return next(new HttpError('No se encontraron turnos', 404));
  }
  res.json({ turnos });
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
  asignTurno,
  cancelTurno,
  cancelledTurnosByPatient,
  deleteTurno,
};
