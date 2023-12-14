const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true },
    email: { type: String, required: true },
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

usuarioSchema.methods.generateAuthToken = async function () {
  const usuario = this;

  const token = jwt.sign({ _id: usuario._id.toString() }, 'mysecret', {
    expiresIn: '360 minutes',
  });

  usuario.tokens = usuario.tokens.concat({ token }); // add token to user's tokens array

  await usuario.save();

  return token;
};

usuarioSchema.statics.findByCredentials = async (email, password) => {
  // statics are accessible on the model
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, usuario.password); // compare plain text password to hashed password
  // console.log(isMatch)

  if (!isMatch) {
    throw new Error('Unable to login');
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
