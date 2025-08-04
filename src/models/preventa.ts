// Modelo Preventa
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/connection";
import { DetallePreventaModel } from "../models/detalle_preventa";
import { ClienteModel } from "./clientes";

// Definir la clase PreventaModel extendiendo de Model
export class PreventaModel extends Model {
  public numero!: number;
  public fecha!: Date;
  public vencimiento!: Date;
  public comprobante!: number;
  public cliente!: number; // FK a Clientes
  public totalneto!: number;
  public codusuario!: number;

  public detalles!: (typeof DetallePreventaModel)[];

  // ✅ Tipado fuerte para la relación con Cliente
  public cliente_info?: {
    codigo: number;
    nombrecliente: string;
  };
}

interface PreventaCreationAttributes
  extends Optional<PreventaModel, "numero"> {}

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
    vencimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    comprobante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalneto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    codusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "preventa",
    tableName: "preventa",
    timestamps: false,
  }
);

// Relaciones

PreventaModel.hasMany(DetallePreventaModel, {
  foreignKey: "iddetalle",
  sourceKey: "numero",
  as: "detalles_preventa", // 👈 nombre único
});

DetallePreventaModel.belongsTo(PreventaModel, {
  foreignKey: "iddetalle",
  targetKey: "numero",
  as: "preventa",
});

PreventaModel.belongsTo(ClienteModel, {
  foreignKey: "cliente",
  targetKey: "codigo",
  as: "cliente_info",
});

ClienteModel.hasMany(PreventaModel, {
  foreignKey: "cliente",
  sourceKey: "codigo",
  as: "preventas",
});
