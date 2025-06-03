import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const CajasModel = sequelize.define('cajas', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
    },

    responsable: {
        type: DataTypes.STRING,
    },

    iniciotimbrado: {
        type: DataTypes.DATE,
    },

    vencetimbrado: {
        type: DataTypes.DATE,
    },

    timbrado: {
        type: DataTypes.NUMBER,
    },

    factura: {
        type: DataTypes.NUMBER,
    },

    expedicion: {
        type: DataTypes.STRING,
    },

    recibo: {
        type: DataTypes.NUMBER,
    },

    impresoracaja: {
        type: DataTypes.STRING,
    },

    estado: {
        type: DataTypes.INTEGER,
    }

})