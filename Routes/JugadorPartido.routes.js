// routes/rutasJugadorPartido.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_JugadorPartido");

router.delete('/eliminar_jugador_partido', controller.eliminarJugadorDePartido);

module.exports = router;
