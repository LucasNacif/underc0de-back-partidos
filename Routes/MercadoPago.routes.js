const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_MercadoPago");

router.post('/create_preference', controller.createPreference);

router.post('/webhook', controller.recibirWebhook);
router.get('/success', controller.recibirBackUrl);
router.get('/failure', controller.recibirBackUrl);
router.get('/pending', controller.recibirBackUrl);


module.exports = router;