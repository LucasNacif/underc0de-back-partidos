const { getAdminIdFromToken } = require("../config/jwtProvider");
const Admin = require("../models/Admin");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Tomamos el token almacenado en el navegador

    if (!token) {
      return res.status(401).json({ msg: "No Token provided" });
    }

    const adminId = getAdminIdFromToken(token); // Obtener el adminId desde el token

    if (!adminId) {
      return res.status(401).json({ msg: "Invalid Token id :" + adminId });
    }

    const adminFound = await Admin.findByPk(adminId);

    if (!adminFound) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    req.admin = adminFound; // Cargar el admin en los datos de la solicitud para usarlo después
  } catch (error) {
    console.error('Error en autenticación:', error); // Log detallado del error en el servidor
    return res.status(500).json({
      msg: 'Error al autenticar el token',
      error: error.message, // Aquí puedes ver el mensaje del error
      stack: error.stack,   // Para obtener más detalles sobre dónde ocurrió el error
    });
  }

  next(); // Cuando termine esto, va hacia el siguiente middleware o ruta
};

module.exports = authenticate;
