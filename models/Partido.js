const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partido = sequelize.define('Partido', {
  idPartido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  limite_jugadores: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'cancelado', 'reprogramado'),
    defaultValue: 'activo'
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Admin',
      key: 'idAdmin'
    }
  }
}, {
  tableName: 'Partido',
  timestamps: false
});

module.exports = Partido;
