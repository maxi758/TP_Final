const express = require("express");

const router = express.Router();

const especialidadController = require("../controllers/especialidad-controller");

router.get("/", especialidadController.getEspecialidades);

router.post("/", especialidadController.createEspecialidad);

module.exports = router;