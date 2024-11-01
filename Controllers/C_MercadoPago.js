// SDK de Mercado Pago
const { Preference, MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

exports.createPreference = async (req, res) => {
    try {
        const body = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: 'ARS',
            },
            ],
            back_urls: {
                success: 'https://a1b8-181-209-77-205.ngrok-free.app/api/success',
                failure: 'https://a1b8-181-209-77-205.ngrok-free.app/api/failure',
                pending: 'https://a1b8-181-209-77-205.ngrok-free.app/api/pending',
            },
            auto_return: 'approved',
            // notification_url: "https://a1b8-181-209-77-205.ngrok-free.app ",
            //la notifiacion se puede poner aca o directamente en la integracion de MP/developers

        }
        const preference = new Preference(client);
        const result = await preference.create({ body })
        console.log(" preferencia: \n", result)
        return res.json({
            id: result.id,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error con la preferencia" })

    }
};

// // Webhook para capturar los detalles del pago
exports.recibirWebhook = async (req, res) => {
    try {
        console.log("__Detalles del pago: ",req.body)
        return res.status(204).send();
    } catch (error) {
        console.error("Error al procesar el webhook:", error);
        return res.status(500).send('Error al procesar el webhook');
    }
};

exports.recibirBackUrl = (req, res) => {
    console.log("__Detalles del back url: ",req.query);
    if (req.query.status == "approved") {
        res.send("pago aprobado");
        //inscribir a jugador
    } else if (req.query.status == "pending") {
        res.send("pago pending");
    } else {
        res.send("pago no aprobado");
    }
}