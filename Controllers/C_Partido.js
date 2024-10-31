const Partido = require("../models/Partido");

exports.crearPartido = async (req, res) => {
    try {
    const PartidoParaCrear = { fecha, hora, ubicacion, limite_jugadores, precio, comentario, estado, idAdmin } = req.body;
        await Partido.create({...PartidoParaCrear});
        return res.status(200).json({ msg: "Partido creado existosamente"});
    } catch (err) {
        return res.status(400).json({ msg: "Error al crear el partido: ", err });
    }
};
exports.obtenerPorID = async (req, res) => {
    try {
        const {idPartido} = req.body;
        const partidoEncontrado = await Partido.findByPk(idPartido);
        return res.status(200).json({partidoEncontrado});
    } catch (error) {
        return res.status(400).json({ msg: "Error al buscar el partido: ", err });
    }
}
exports.obtenerPartido = async (req,res) =>{
    try {
        const partidos = await Partido.findAll();
        return res.status(200).json({partidos});
    } catch (error) {
        return res.status(400).json({ msg: "Error al buscar los partidos: "});
    }
}
//metodo de modificar
//metodo de eliminar
//metodo de baja

