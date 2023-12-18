const mongoose = require('mongoose');

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

const Medico = mongoose.model('Medico', medicoSchema);

module.exports = Medico;
