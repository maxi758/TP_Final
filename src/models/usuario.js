const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
  turnos: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Turno' }],
});

module.exports = mongoose.model('Usuario', usuarioSchema);
