import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/connection";
import { PreventaModel } from './preventa';
import { ProductosModel } from './productos';

export const DetallePreventaModel = sequelize.define('detallepreventa',{
    iddetalle: { type: DataTypes.INTEGER},
    codprod: { type: DataTypes.STRING, allowNull: false }, // FK a Productos
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    prcosto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    impiva: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    porcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: true }
});

DetallePreventaModel.hasMany(ProductosModel, { foreignKey: 'codigo' });
DetallePreventaModel.belongsTo(ProductosModel, { foreignKey: 'codigo' });

PreventaModel.hasMany(DetallePreventaModel, { foreignKey: 'iddetalle' }); // Relación con DetallePreventas
DetallePreventaModel.belongsTo(PreventaModel, { foreignKey: 'numero' });


