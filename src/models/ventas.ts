// ventas.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/connection";
import { ClienteModel } from "./clientes";
import { DetalleVentasModel } from "./detalle_ventas";

// Definimos la clase
export class VentasModel extends Model {
  public idventa!: number;
  public creferencia!: string;
  public fecha!: Date;
  public factura!: number;
  public formatofactura!: string;
  public vencimiento!: Date;
  public cliente!: number;
  public sucursal!: number;
  public moneda!: number;
  public comprobante!: number;
  public cotizacion!: number;
  public preventa!: number;
  public vendedor!: number;
  public camion!: number;
  public caja!: number;
  public supago!: number;
  public sucambio!: number;
  public exentas!: number;
  public gravadas10!: number;
  public gravadas5!: number;
  public totalneto!: number;
  public cuotas!: number;
  public iniciovencetimbrado!: Date;
  public vencimientotimbrado!: Date;
  public nrotimbrado!: number;
  public idusuario!: number;

  // Asociación opcional para tipado fuerte
  public cliente_info?: {
    codigo: number;
    nombrecliente: string;
  };
}

// Para permitir creación sin ID
interface VentasCreationAttributes extends Optional<VentasModel, "idventa"> {}

VentasModel.init(
  {
    
    idventa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creferencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    factura: {
      type: DataTypes.INTEGER,
    },
    formatofactura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vencimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    moneda: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comprobante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preventa : {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    cotizacion: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vendedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    camion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caja: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supago: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sucambio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    exentas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gravadas10: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gravadas5: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalneto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cuotas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iniciovencetimbrado: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vencimientotimbrado: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nrotimbrado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ventas",
    tableName: "cabecera_ventas",
    timestamps: false,
  }
);

// Relaciones

VentasModel.hasMany(DetalleVentasModel, {
  foreignKey: "idventadet",
  sourceKey: "idventa",
  as: "detalles_venta", // 👈 nombre único diferente
});


VentasModel.belongsTo(ClienteModel, {
  foreignKey: "cliente",
  targetKey: "codigo",
  as: "cliente_info",
});

ClienteModel.hasMany(VentasModel, {
  foreignKey: "cliente",
  sourceKey: "codigo",
  as: "ventas",
});
// Exportamos el modelo