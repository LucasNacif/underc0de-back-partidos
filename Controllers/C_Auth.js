const { generateAccessToken } = require("../config/jwtProvider");

const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Todos los campos son neccesarios" });
  }
  try {
    const admin = await Admin.findOne({ where: { email: email } });
    console.log(admin);
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Contraseña invalida" });
    }

    const jwtAdmin = generateAccessToken(admin.idAdmin);
    res.cookie("token", jwtAdmin);
    return res.status(200).send({
      message: "Login exitoso",
      jwtAdmin,
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
exports.logout = (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    return res.status(200).send({ message: "Sesion cerrada" });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
