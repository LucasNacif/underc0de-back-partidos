const JugadorPartido = require("../models/JugadorPartido");
const Jugador = require("../models/Jugador");

exports.darDeBajaJugador = async (req, res) => {
    try {
        const { idJugador, idPartido } = req.body;

        // se ve si hay relacion entre jugador y partido
        const jugadorPartido = await JugadorPartido.findOne({
            where: { idJugador, idPartido }
        });

        if (!jugadorPartido) {
            return res.status(404).json({ message: "El jugador no está inscrito en este partido." });
        }

        // Eliminar la relación en jugadorPartido
        await jugadorPartido.destroy();

        return res.status(200).json({ message: "Jugador dado de baja exitosamente." });
    } catch (error) {
        return res.status(500).json({ message: "Error al dar de baja.", error });
    }
};
