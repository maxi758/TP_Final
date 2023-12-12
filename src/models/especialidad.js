const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const especialidadSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  medicos: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Medico' }], //revisar si relacion conviene aquí
});

module.exports = mongoose.model('Especialidad', especialidadSchema);
