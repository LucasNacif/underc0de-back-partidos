//proveeedor de json web token

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const generateAccessToken = (adminId) => {
  const token = jwt.sign({ id: adminId }, SECRET_KEY, { expiresIn: "48h" }); // nos genera un token con un algoritmo de firma especifico y la clave secreta, en la carga util coloca el dato(id)
  return token;
};

const getAdminIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY);
  //verifico y decodifico el token, un token válido consta de tres partes: el encabezado (header), la carga útil (payload) y la firma (signature), separados por puntos (.).Le pasamos el token y la clave secreta con la que recalcula la firma y compara.Internamente, el método separa la carga útil y la firma del token.

  return decodedToken.id; //hacemos uso de lo que deberia estar "almacenado" en el token cuando se creó
};
module.exports = { generateAccessToken, getAdminIdFromToken };
