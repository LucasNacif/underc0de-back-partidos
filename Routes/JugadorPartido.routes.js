const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_JugadorPartido");

router.delete('/eliminar_jugador_partido', controller.eliminarJugadorDePartido);
router.get('/:idPartido/jugadores', controller.obtenerJugadoresDePartido);
router.post("/inscribir", controller.inscribirJugador);

module.exports = router;
