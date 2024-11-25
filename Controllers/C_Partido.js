const Partido = require("../models/Partido");

exports.crearPartido = async (req, res) => {
  try {
    const PartidoParaCrear = ({
      fecha,
      hora,
      ubicacion,
      limite_jugadores,
      precio,
      comentario,
      estado,
      idAdmin,
    } = req.body);
    await Partido.create({ ...PartidoParaCrear });
    return res.status(200).json({ msg: "Partido creado existosamente" });
  } catch (err) {
    return res.status(400).json({ msg: "Error al crear el partido: ", err });
  }
};
exports.obtenerPorID = async (req, res) => {
  try {
    const { idPartido } = req.body;
    const partidoEncontrado = await Partido.findByPk(idPartido);
    return res.status(200).json({ partidoEncontrado });
  } catch (error) {
    return res.status(400).json({ msg: "Error al buscar el partido: ", err });
  }
};
exports.obtenerPartido = async (req, res) => {
  try {
    const partidos = await Partido.findAll();
    return res.status(200).json({ partidos });
  } catch (error) {
    return res.status(400).json({ msg: "Error al buscar los partidos: " });
  }
};
exports.obtenerPartidosPorEstado = async (req, res) => {
  try {
    const estado = req.params.estado;

    // Validacion de estados permitidos
    const estadosPermitidos = ["activo", "cancelado", "reprogramado"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    const partidos = await Partido.findAll({ where: { estado } });

    res.json({ Partidos: partidos });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Error al buscar los partidos por estado" });
  }
};

exports.eliminarPartido = async (req, res) => {
  try {
    const idMatch = req.params.id;

    const match = await Partido.findByPk(idMatch);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: `No existe el partido con id: ${idMatch}`,
      });
    }

    await Partido.destroy({
      where: {
        idPartido: idMatch,
      },
    });

    return res.status(200).send("Partido eliminado exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
};
exports.editarPartido = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "El ID es requerido en los parametros",
      });
    }

    const matchExist = await Partido.findByPk(id);
    if (!matchExist) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un partido con el ID: ${id}`,
      });
    }
    //creo un nuevo objeto mezclando los datos del partido obtenido de la db y los que manda el front a actualizar

    await Partido.update(
      {
        ...matchExist.dataValues,
        ...req.body,
      },
      {
        where: { id },
      }
    );

    const updatedMatch = await Partido.findByPk(id);
    return res.status(200).json({
      success: true,
      message: "Partido actualizado exitosamente",
      partido: updatedMatch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
};
exports.cancelarPartido = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "El ID es requerido en los parametros",
      });
    }
    await Partido.update(
      { estado: "cancelado" },
      {
        where: { id: 1 },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Partido cancelado",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
};

//metodo de baja
