const express = require('express');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const HttpError = require('./models/http-error');

const especialidadRoutes = require('./routes/especialidad-route');
const medicoRoutes = require('./routes/medico-route');
const turnoRoutes = require('./routes/turno-route');
const usuarioRoutes = require('./routes/usuario-route');

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * para que cualquier dominio pueda acceder a la api
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // los headers que se pueden usar
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // los metodos http que se pueden usar
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/especialidades', especialidadRoutes);

app.use('/api/medicos', medicoRoutes);

app.use('/api/turnos', turnoRoutes);

app.use('/api/usuarios', usuarioRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknow error has ocurred' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjtjxec.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
