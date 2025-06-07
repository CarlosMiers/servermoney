import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const ProductosModel = sequelize.define('productos', {
    codigo: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
    },

    costo: {
        type: DataTypes.NUMBER,
    },
    
    precio_maximo: {
        type: DataTypes.NUMBER,
    },

    ivaporcentaje: {
        type: DataTypes.NUMBER,
    },


    estado: {
        type: DataTypes.INTEGER,
    }

})