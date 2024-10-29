const Partido = require("../models/Partido");

exports.crearPartido = async (req, res) => {

    console.log(req.body);
    try {
    const PartidoParaCrear = { fecha, hora, ubicacion, limite_jugadores, precio, comentario, estado, idAdmin } = req.body;
        await Partido.create({...PartidoParaCrear});
        return res.status(200).json({ msg: "Partido creado existosamente"});
    } catch (err) {
        return res.status(400).json({ msg: "Error al crear el partido: ", err });
    }
};

//metodo de modificar
//metodo de eliminar
//metodo de baja

