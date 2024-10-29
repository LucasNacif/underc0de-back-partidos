const express = require('express');
const dotenv = require('dotenv');
const app = express();
const sequelize = require('./config/database');
dotenv.config();
app.use(express.json());

//pa sincronizar la bd
const admin = require("./models/Admin");

sequelize.authenticate()
.then(() => console.log('Conexion con la base de datos Ok'))
.catch((err) => console.log(err.message));

//NOTAS:
//force:true --> elimina las tablas y las actualiza
//force:false --> no elimina las tablas y las actualiza
sequelize.sync({force:false})
.then(() => console.log('Base de datos sincronizada'))
.catch((err) => console.log(err.message));

//Rutas
const rutasPartido = require("./Routes/R_Partido")
app.use("/partido" , rutasPartido);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
