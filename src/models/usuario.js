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

usuarioSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, 'mysecret', {
    expiresIn: '360 minutes',
  });

  user.tokens = user.tokens.concat({ token }); // add token to user's tokens array

  await user.save();

  return token;
};

usuarioSchema.statics.findByCredentials = async (email, password) => {
  // statics are accessible on the model
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password); // compare plain text password to hashed password
  // console.log(isMatch)

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

usuarioSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    // true if password is being modified
    user.password = await bcrypt.hash(user.password, 8);
  }

  // console.log('just before saving!')

  next();
});


module.exports = mongoose.model('Usuario', usuarioSchema);
