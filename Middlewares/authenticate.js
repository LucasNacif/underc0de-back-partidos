const { getAdminIdFromToken } = require("../config/jwtProvider");
const Admin = require("../models/Admin");
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; //tomamos el token "almacenado" en el navegador

    if (!token) {
      return res.status(401).json({ msg: "No Token provided" });
    }

    const adminId = getAdminIdFromToken(token);

    if (!adminId) {
      return res.status(401).json({ msg: "Invalid Token id :" + userId });
    }

    const adminFound = await Admin.findByPk(adminId);

    req.admin = adminFound; //cargo el user a los datos de la solicitud para usarlo despues
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
  next(); // entonces cuando termine esto va hacia el proximo paso en la ruta donde se usa
};

module.exports = authenticate;
