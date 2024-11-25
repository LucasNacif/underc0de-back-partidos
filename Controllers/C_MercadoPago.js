const { Preference, MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN, options: { timeout: 5000 } });
const preference = new Preference(client);

exports.createPreference = async (req, res) => {
    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: req.body.title,
                        quantity: Number(req.body.quantity),
                        unit_price: Number(req.body.price),
                        currency_id: 'ARS',
                        description_metadata: JSON.stringify({
                            partidoId: req.body.partidoId,
                            jugadores: req.body.jugadores
                        })
                    }
                ],
                back_urls: {
                    success: process.env.URL_NGROK + '/api/success',
                    failure: process.env.URL_NGROK + '/api/failure',
                    pending: process.env.URL_NGROK + '/api/pending',
                },
                auto_return: 'approved',
            }
        });

        return res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error con la preferencia" });
    }
};


exports.recibirWebhook = async (req, res) => {
    //Siempre devolver 200 para que mp no siga enviando la noti
    try {
        const paymentId = req.body.data.id;
        console.log("Informacion recibida en el webhook: ", req.body)
        if (req.body.type === 'payment') {
            console.log("Tipo Payment")
            const paymentInfo = await new Payment(client).get({ id: paymentId });
            console.log('Información del pago:', paymentInfo);

            if (paymentInfo.status === 'approved') {
                console.log("El pago ha sido aprobado");
                //aqui hay que traer los datos del que esta pagando  y crear un jugador
                //tambien inscribir al jugador
                //verificar si el jugador no esta inscripto ya, porque mp puede mandar varios webhook y el 
                //jugador se va a inscribir mas de una vez
                return res.status(200).json({ success: true });
            }
            return res.status(200).json({ success: true });
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(200).json({ success: false });
    }
};

// Success, failure y pending URLs
exports.handleSuccess = async (req, res) => {
    const {
        payment_id,
        status,
        merchant_order_id
    } = req.query;

    if (status === 'approved') {
        // Redirigir a tu frontend con éxito
        console.log("pago aprobado")
        return res.send("pago aprobado");
    }
};

exports.handleFailure = async (req, res) => {
    // Redirigir a tu frontend con fallo
    console.log("falló el pago")
    return res.send("falló el pago");
};

exports.handlePending = async (req, res) => {
    // Redirigir a tu frontend con pendiente
    console.log("El pago esta pedendiente")
    return res.send("El pago esta pedendiente");
};