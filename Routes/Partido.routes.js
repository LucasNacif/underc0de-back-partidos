const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_Partido");


router.post("/crear", controller.crearPartido);
router.get("/obtener", controller.obtenerPartido);
router.get("/obtenerPorId", controller.obtenerPorID);
router.get("/obtener/:estado", controller.obtenerPartidosPorEstado);
router.delete("/eliminar/:id", controller.eliminarPartido);
router.put("/editar/:id", controller.editarPartido);


module.exports = router;

