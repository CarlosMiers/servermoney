// Modelo Preventa
import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/connection";
import { ClienteModel } from "../models/clientes";
import { DetallePreventaModel } from "../models/detalle_preventa";

export const PreventaModel = sequelize.define('preventa',{
    numero: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    comprobante: { type: DataTypes.STRING, allowNull: false },
    cliente: { type: DataTypes.INTEGER, allowNull: false }, // FK a Clientes
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { modelName: 'preventa' });

PreventaModel.belongsTo(ClienteModel, { foreignKey: 'cliente', as: 'clienteInfo' }); // Relación con Clientes con alias
ClienteModel.hasMany(PreventaModel, { foreignKey: 'cliente' });
