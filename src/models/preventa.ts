// Modelo Preventa
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/connection";
import { DetallePreventaModel } from "../models/detalle_preventa";

// Definir la clase PreventaModel extendiendo de Model
export class PreventaModel extends Model {
  public numero!: number;
  public fecha!: Date;
  public comprobante!: number;
  public cliente!: number; // FK a Clientes
  public totalneto!: number;
  public codusuario!: number; // Nuevo campo para almacenar el código de usuario
  public detalles!: (typeof DetallePreventaModel)[];
}

interface PreventaCreationAttributes extends Optional<PreventaModel, 'numero'> {}

// Inicialización del modelo Preventa
PreventaModel.init(
  {
    numero: {
      type: DataTypes.FLOAT,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    comprobante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cliente: {
      type: DataTypes.INTEGER,
      allowNull: false, // FK a Clientes
    },
    totalneto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    codusuario: {
      type: DataTypes.INTEGER,
      allowNull: false, // Nuevo campo codusuario para almacenar el código del usuario
    },
  },
  {
    sequelize,
    modelName: "preventa",
    tableName: "preventa",
    timestamps: false, // Si no estás usando timestamps
  }
);

// Relación de Preventa con Cliente

PreventaModel.hasMany(DetallePreventaModel, {
  foreignKey: "iddetalle", // <- este es el campo en detalle_preventa que apunta a preventa.numero
  sourceKey: "numero",     // <- campo en preventa que se enlaza
  as: "detalles",
});

DetallePreventaModel.belongsTo(PreventaModel, {
  foreignKey: "iddetalle", // <- este es el campo en detalle_preventa
  targetKey: "numero",     // <- campo en preventa que se enlaza
  as: "preventa",
});