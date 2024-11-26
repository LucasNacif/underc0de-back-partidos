const { Preference, MercadoPagoConfig, Payment } = require('mercadopago');
const JugadorPartido = require('../models/JugadorPartido');
const Partido = require('../models/Partido');
const Jugador = require('../models/Jugador');
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
                    success: process.env.URL_DEPLOY + '/api/success',
                    failure: process.env.URL_DEPLOY + '/api/failure',
                    pending: process.env.URL_DEPLOY + '/api/pending',
                },
                metadata: {
                    jugadores: req.body.jugadores,
                    id_partido: req.body.idPartido,

                },
                auto_return: 'approved',
            }
        })
    
        return res.status(200).json({
            url: result.init_point,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error con la preferencia" });
    }

};


exports.recibirWebhook = async (req, res) => {
    //Siempre devolver 200 para que mp no siga enviando la noti
    try {
        const paymentId = req.body.data.id;
      
        if (req.body.type === 'payment') {
            const paymentInfo = await new Payment(client).get({ id: paymentId });

            if (paymentInfo.status === 'approved') {
                console.log("El pago ha sido aprobado");

                console.log("metadata: ", paymentInfo.metadata)

                const jugadores = paymentInfo.metadata.jugadores;
                const idPartido = paymentInfo.metadata.id_partido;

                const resultado = await inscribirJugador(jugadores, idPartido)
                console.log("Resultado de inscripción:", resultado);

            } else if (paymentInfo.status === 'pending') {
                console.log("El pago está pendiente");
            } else if (paymentInfo.status === 'failed') {
                console.log("El pago ha fallado");
            }

            //aca se puede redirigir a una pagina que te muestre un ok
        
            return res.status(200).json({ success: true });
        }
    }catch (error) {
    console.error('Error:', error);
    return res.status(200).json({ success: false });
}
}


// Success, failure y pending URLs
exports.handleSuccess = async (req, res) => {
    const {status} = req.query;
    if (status === 'approved') {
        return res.redirect(`${process.env.FRONTEND_URL}/listar-partidos`);
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


async function inscribirJugador(jugadores, idPartido) {
    console.log('ID Partido recibido:', idPartido);

    const resultado = [];
    try {
        const partido = await Partido.findByPk(idPartido);
        if (!partido) {
            return {
                message: "El partido no existe",
                status: 404,
            };
        }
        for (const jugadorData of jugadores) {
            const { num_doc, nombre, apellido, telefono, asistencia_after } = jugadorData;

            if (!num_doc || !nombre || !apellido || !telefono) {
                console.log("Faltan datos del jugador:", jugadorData);
                continue;
            }

            const [jugador, created] = await Jugador.findOrCreate({
                where: { numDoc:num_doc },
                defaults: { nombre, apellido, telefono, asistenciaAfter:asistencia_after },
            });

            // Verificar si el jugador ya está inscrito en el partido
            const yaInscrito = await JugadorPartido.findOne({
                where: { idJugador: jugador.idJugador, idPartido }
            });
            if (yaInscrito) {
                resultado.push({
                    jugador: numDoc,
                    message: "El jugador ya está inscrito en este partido",
                    status: 400,
                });
                continue;
            }
            // Crear la relación entre jugador y partido
            await JugadorPartido.create({
                idJugador: jugador.idJugador,
                idPartido
            });

            resultados.push({
                jugador: numDoc,
                message: created
                    ? "Jugador creado e inscrito exitosamente en el partido"
                    : "Jugador inscrito exitosamente en el partido",
                status: 200,
            });

        }
        return {
            message: "Inscripción finalizada",
            detalles: resultado,
            status: 200,
        };
    } catch (error) {
        console.error("Error al inscribir jugadores:", error);
        return {
            message: "Error interno del servidor",
            status: 500,
        };
    }
};