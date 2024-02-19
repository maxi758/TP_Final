const mongoose = require('mongoose');
const Turno = require('./turno');
const Schema = mongoose.Schema;

const medicoSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  matricula: { type: String, required: true },
  especialidad: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Especialidad',
  },
  turnos: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Turno' }],
});

// elimina los turnos de un medico cuando se elimina el medico

medicoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const medicoToDelete = await this.model.findOne(this.getQuery());
    if (!medicoToDelete) {
      return next(new Error('No se encontró el medico a eliminar'));
    }
    console.log(medicoToDelete);
    await Turno.deleteMany({ medico: medicoToDelete._id });
    next();
  } catch (err) {
    const error = new HttpError(
      'Error en la consulta, intente de nuevo más tarde',
      500
    );
    console.log(err);
    return next(error);
  }
});

const Medico = mongoose.model('Medico', medicoSchema);

module.exports = Medico;
