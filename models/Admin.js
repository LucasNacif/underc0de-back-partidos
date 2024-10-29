const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    idAdmin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    alias:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cvu:{
        type: DataTypes.STRING(22),
        allowNull: false
    },
    telefono:{
        type: DataTypes.STRING(100),
        allowNull: false
    }

},{
    tableName: 'Admin',
    timestamps: false
});

module.exports = Admin;