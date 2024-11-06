const { Router } = require("express");
const router = Router();
const authController = require("../Controllers/C_Auth");
const authenticate = require("../Middlewares/authenticate");

router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
