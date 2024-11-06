const express = require("express");
const router = express.Router();
const controller = require("../Controllers/C_MercadoPago");

router.post('/create_preference', controller.createPreference);

router.post('/webhook', controller.recibirWebhook);

router.get('/success', controller.handleSuccess);
router.get('/failure', controller.handleFailure);
router.get('/pending', controller.handlePending);


module.exports = router;