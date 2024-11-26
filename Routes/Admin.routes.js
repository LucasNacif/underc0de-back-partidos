const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/C_Admin");
const authenticate = require("../Middlewares/authenticate");
router.post("/registrar", adminController.register); //para registar por primera vez quito la autenticacion
router.get("/obtener", authenticate, adminController.obtenerTodosLosAdmin);
router.get("/obtenerPorId/:id", authenticate,adminController.obtenerAdminPorId);
router.put("/editar/:id", authenticate, adminController.editarAdmin);
router.delete("/eliminar/:id", authenticate, adminController.eliminarAdmin);

module.exports = router;
