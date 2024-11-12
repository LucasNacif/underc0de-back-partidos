const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_JugadorPartido"); // Asegúrate de que la ruta sea correcta

router.delete('/eliminar_jugador_partido', controller.eliminarJugadorDePartido);
router.get('/partido/:idPartido/jugadores', controller.obtenerJugadoresDePartido);

module.exports = router;
