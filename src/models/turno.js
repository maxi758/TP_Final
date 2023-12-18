const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const turnoSchema = new Schema({
  fecha: { type: Date, required: true },
  estado: { type: String, required: true },
  observaciones: { type: String, required: true },
  medico: { type: mongoose.Types.ObjectId, required: true, ref: 'Medico' },
  usuario: { type: mongoose.Types.ObjectId, required: false, ref: 'Usuario' },
});

const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno;
