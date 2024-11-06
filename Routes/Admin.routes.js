const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/C_Admin");
const authenticate = require("../Middlewares/authenticate");
router.post("/registrar", authenticate, adminController.register);
router.get("/obtener", authenticate, adminController.obtenerTodosLosAdmin);
router.put("/editar/:id", authenticate, adminController.editarAdmin);
router.delete("/eliminar/:id", authenticate, adminController.eliminarAdmin);
router.get(
  "/obtenerPorId/:id",
  authenticate,
  adminController.obtenerAdminPorId
);

module.exports = router;
