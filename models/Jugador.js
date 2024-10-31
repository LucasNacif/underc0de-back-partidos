const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jugador = sequelize.define('Jugador', {
  idJugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numDoc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  asistenciaAfter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Jugador',
  timestamps: false
});

module.exports = Jugador;
