const { getAdminIdFromToken } = require("../config/jwtProvider");
const Admin = require("../models/Admin");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; 

    if (!authHeader) {
      return res.status(401).json({ msg: "No Token provided" });
    }

    const token = authHeader.split(' ')[1]; // Separar "Bearer" y el token

    if (!token) {
      return res.status(401).json({ msg: "No Token provided" });
    }

    // Obtener el adminId desde el token
    const adminId = getAdminIdFromToken(token);

    if (!adminId) {
      return res.status(401).json({ msg: "Invalid Token id :" + adminId });
    }

    // Buscar al admin en la base de datos
    const adminFound = await Admin.findByPk(adminId);

    if (!adminFound) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Añadir al admin al objeto request para acceder a él en los siguientes middlewares o rutas
    req.admin = adminFound;

  } catch (error) {
    console.error('Error en autenticación:', error); // Log detallado del error
    return res.status(500).json({
      msg: 'Error al autenticar el token',
      error: error.message, // Aquí puedes ver el mensaje del error
      stack: error.stack,   // Para obtener más detalles sobre dónde ocurrió el error
    });
  }

  next(); // Llamar al siguiente middleware o ruta
};

module.exports = authenticate;
