const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_Partido");

router.post('/crear', controller.crearPartido);
//ruta para modificar
//ruta para crear
//ruta para baja
module.exports = router;