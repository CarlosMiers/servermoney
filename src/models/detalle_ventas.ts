import {  DataTypes } from "sequelize";
import sequelize from "../db/connection";
import { ProductosModel } from './productos';
export const DetalleVentasModel = sequelize.define("detalle_ventas", {

  item: { type: DataTypes.FLOAT,
       primaryKey: true,
        autoIncrement: true },
   
  idventadet: {
    type: DataTypes.INTEGER,
  },
  dreferencia: {
    type: DataTypes.STRING,
  },
  codprod: {
    type: DataTypes.STRING,
  },
  cantidad: {
    type: DataTypes.DECIMAL,
  },
  precio: {
    type: DataTypes.DECIMAL,
  },
  prcosto: {
    type: DataTypes.DECIMAL,
  },
  monto: {
    type: DataTypes.DECIMAL,
  },
  impiva: {
    type: DataTypes.DECIMAL,
  },
  porcentaje: {
    type: DataTypes.DECIMAL,
  },
  suc: {
    type: DataTypes.INTEGER,
  },
});


DetalleVentasModel.belongsTo(ProductosModel, {
  foreignKey: "codprod",  // 🔧 Este es el campo en detalle que apunta a productos
  targetKey: "codigo",    // 🔧 Este es el campo en productos
  as: "producto",         // Este alias es el que usas en `include`
});
// ProductoModel

ProductosModel.hasMany(DetalleVentasModel, {
  foreignKey: "codprod",
  as: "detalle_ventas",
});
