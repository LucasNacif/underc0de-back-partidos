const sequelize = require('./config/database');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//pa sincronizar la bd
const admin = require("./models/Admin");

sequelize.authenticate()
    .then(() => console.log('Conexion con la base de datos Ok'))
    .catch((err) => console.log(err.message));

//NOTAS:
//force:true --> elimina las tablas y las actualiza
//force:false --> no elimina las tablas y las actualiza
sequelize.sync({ force: false })
    .then(() => console.log('Base de datos sincronizada'))
    .catch((err) => console.log(err.message));

//Rutas
const rutasMP = require("./Routes/MercadoPago.routes.js");
app.use("/api", rutasMP);

const rutasPartido = require("./Routes/Partido.routes.js");
app.use("/api/partido", rutasPartido);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});

module.exports = app;