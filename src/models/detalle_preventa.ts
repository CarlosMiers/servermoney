import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/connection";
import {  ProductosModel } from "../models/productos";


export const DetallePreventaModel = sequelize.define('detalle_preventas',{
    iditem: { type: DataTypes.FLOAT, primaryKey: true, autoIncrement: true },
    iddetalle: { type: DataTypes.FLOAT},
    codprod: { type: DataTypes.STRING, allowNull: false }, // FK a Productos
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    prcosto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    impiva: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    porcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: true }
})

DetallePreventaModel.belongsTo(ProductosModel, {
  foreignKey: "codprod",  // 🔧 Este es el campo en detalle que apunta a productos
  targetKey: "codigo",    // 🔧 Este es el campo en productos
  as: "producto",         // Este alias es el que usas en `include`
});
// ProductoModel
ProductosModel.hasMany(DetallePreventaModel, {
  foreignKey: "codprod",
  as: "detalles",
});
