import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export interface CuentaClienteAttributes {
  id: number;
  idventa: number;
  iddocumento: string;
  creferencia: string;
  documento: number;
  fecha: Date;
  vencimiento: Date;
  cliente: string;
  sucursal: number;
  moneda: number;
  vendedor: number;
  caja: number;
  importe: number;
  numerocuota: number;
  cuota: number;
  saldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CuentaClienteInstance
  extends Model<CuentaClienteAttributes>,
    CuentaClienteAttributes {}

export const CuentaClientesModel = sequelize.define(
  "cuenta_clientes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idventa: {
      type: DataTypes.INTEGER,
    },
    iddocumento: {
      type: DataTypes.STRING,
    },
    creferencia: {
      type: DataTypes.STRING,
    },
    documento: {
      type: DataTypes.NUMBER,
    },
    fecha: {
      type: DataTypes.DATE,
    },
    vencimiento: {
      type: DataTypes.DATE,
    },
    cliente: {
      type: DataTypes.STRING,
    },
    sucursal: {
      type: DataTypes.INTEGER,
    },
    moneda: {
      type: DataTypes.INTEGER,
    },
    vendedor: {
      type: DataTypes.INTEGER,
    },
    caja: {
      type: DataTypes.INTEGER,
    },
    importe: {
      type: DataTypes.DECIMAL(18, 2),
    },
    numerocuota: {
      type: DataTypes.INTEGER,
    },
    cuota: {
      type: DataTypes.INTEGER,
    },
    saldo: {
      type: DataTypes.DECIMAL(18, 2),
    },
  },
  {
    tableName: "cuenta_clientes", // 👈 Evita que Sequelize cambie el nombre de la tabla
    timestamps: true, // ✅ Agrega los campos `createdAt` y `updatedAt`
  }
);
