const JugadorPartido = require('../models/JugadorPartido');
const Partido = require('../models/Partido');
const Jugador = require('../models/Jugador');

exports.eliminarJugadorDePartido = async (req, res) => {
    const { idJugador, idPartido } = req.body; 

    if (!idJugador || !idPartido) {
        return res.status(400).json({ error: "Se requieren ambos IDs" });
    }
    try {
        // Consulta para eliminar la relación de la tabla "JugadorPartido"
        const result = await JugadorPartido.destroy({
            where: {
                idJugador: idJugador,
                idPartido: idPartido
            }
        });
        if (result > 0) {
            return res.json({ message: "Jugador eliminado del partido" });
        } else {
            return res.status(404).json({ error: "No se encontró la relación." });
        }
    } catch (error) {
        console.error("Error al eliminar jugador de partido:", error);
        return res.status(500).json({ error: "Error en el servidor." });
    }
};


exports.obtenerJugadoresDePartido = async (req, res) => {
    const { idPartido } = req.params;

  try {
    const partido = await Partido.findByPk(idPartido, {
      include: [
        {
          model: Jugador,
          attributes: ["idJugador", "numDoc", "nombre", "apellido", "telefono", "asistenciaAfter"],
          through: { attributes: [] }, 
        },
      ],
    });

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }
    return res.status(200).json({
      message: "Jugadores obtenidos exitosamente",
      jugadores: partido.Jugadors,  
    });

  } catch (error) {
    console.error("Error al obtener jugadores:", error.message);
    return res.status(500).json({ message: "Error al obtener jugadores" });
  }
};



