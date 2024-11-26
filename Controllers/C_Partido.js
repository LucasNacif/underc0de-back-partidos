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
exports.eliminarPartido = async (req, res) => {
  try {
    const idPartido = req.params.id;
    await Partido.destroy({ where: { idPartido: idPartido } });
    return res.status(200).json({ msg: "Partido eliminado existosamente" });
  } catch (err) {
    return res.status(400).json({ msg: "Error al eliminar el partido: ", err });
  }
}
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
    const { estado, ordenamiento } = req.query;

    // Validacion de estados permitidos
    const estadosPermitidos = ["activo", "cancelado", "reprogramado"];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    // Configurar el orden de los resultados
    let order = [['fecha', 'ASC']]; // Default sorting

    switch (ordenamiento) {
      case 'fecha_desc':
        order = [['fecha', 'DESC']];
        break;
      case 'precio_asc':
        order = [['precio', 'ASC']];
        break;
      case 'precio_desc':
        order = [['precio', 'DESC']];
        break;
      default:
        // Default is fecha_asc
        break;
    }

    const partidos = await Partido.findAll({ 
      where: { estado },
      order: order
    });

    res.json({ Partidos: partidos });
  } catch (error) {
    console.error('Error al buscar los partidos:', error);
    return res
      .status(500)
      .json({ msg: "Error al buscar los partidos por estado", error: error.message });
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
        where: { idPartido: id },
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


