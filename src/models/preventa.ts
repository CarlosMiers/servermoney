// Modelo Preventa
import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/connection";
import { ClienteModel } from "../models/clientes";

export const PreventaModel = sequelize.define('preventa',{
    numero: { type: DataTypes.FLOAT, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    comprobante: { type: DataTypes.INTEGER, allowNull: false },
    cliente: { type: DataTypes.INTEGER, allowNull: false }, // FK a Clientes
    totalneto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { modelName: 'preventa' });

PreventaModel.belongsTo(ClienteModel, { foreignKey: 'cliente', as: 'clienteInfo' }); // Relación con Clientes con alias
ClienteModel.hasMany(PreventaModel, { foreignKey: 'cliente' });
