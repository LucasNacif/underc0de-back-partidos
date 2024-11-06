const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Jugador = require('./Jugador');
const Partido = require('./Partido');

const JugadorPartido = sequelize.define('JugadorPartido', {
    idJugador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Jugador,
            key: 'idJugador'
        }
    },
    idPartido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Partido,
            key: 'idPartido'
        }
    }
}, {
    tableName: 'JugadorPartido',
    timestamps: false,
});

// Relaciones
Jugador.belongsToMany(Partido, { through: JugadorPartido, foreignKey: 'idJugador' });
Partido.belongsToMany(Jugador, { through: JugadorPartido, foreignKey: 'idPartido' });

module.exports = JugadorPartido;
