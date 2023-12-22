const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpError = require('../models/http-error');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    //dni: { type: String, required: true },
    email: { type: String, unique:true, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    turnos: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Turno' }],
    tokens: [
      // array of objects
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Para que no se envíen password y tokens en la respuesta, salvo que uno los agregue en el response
usuarioSchema.methods.toJSON = function () {
  const usuario = this;
  const usuarioObjeto = usuario.toObject();

  delete usuarioObjeto.password;
  delete usuarioObjeto.tokens;

  return usuarioObjeto;
};


usuarioSchema.methods.generateAuthToken = async function () {
  const usuario = this;

  const token = jwt.sign({ _id: usuario._id.toString(), rol: usuario.rol }, 'mysecret', {
    expiresIn: '360 minutes',
  });

  usuario.tokens = usuario.tokens.concat({ token }); 

  await usuario.save();

  return token;
};

usuarioSchema.statics.findByCredentials = async (email, password) => {
  // statics son métodos que se pueden llamar directamente sobre el modelo, sin necesidad de instanciarlo
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    throw new HttpError('Error al iniciar sesión', 401);
  }

  const isMatch = await bcrypt.compare(password, usuario.password); 

  if (!isMatch) {
    throw new HttpError('Error al iniciar sesión', 401);
  }

  return usuario;
};

usuarioSchema.pre('save', async function (next) {
  const usuario = this;

  if (usuario.isModified('password')) {
    // true if password is being modified
    usuario.password = await bcrypt.hash(usuario.password, 8);
  }

  // console.log('just before saving!')

  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
