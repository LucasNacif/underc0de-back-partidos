const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const After = sequelize.define('After', {
  idJugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Jugador',
      key: 'idJugador'
    },
    onDelete: 'CASCADE'
  },
  idPartido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Partido',
      key: 'idPartido'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'After',
  timestamps: false
});

module.exports = After;
