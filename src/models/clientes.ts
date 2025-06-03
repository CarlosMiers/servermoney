import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const ClienteModel = sequelize.define('clientes', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
    },
    fechanacimiento: {
        type: DataTypes.DATE,
    },
    cedula: {
        type: DataTypes.STRING,
    },
    ruc: {
        type: DataTypes.STRING,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    telefono: {
        type: DataTypes.STRING,
    },

    latitud: {
        type: DataTypes.STRING,
    },
    longitud: {
        type: DataTypes.STRING,
    },
    mail: {
        type: DataTypes.STRING,
    },
    sexo: {
        type: DataTypes.INTEGER,
    },
    estado: {
        type: DataTypes.INTEGER,
    }

})
