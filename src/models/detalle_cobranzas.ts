import { Model, DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const DetalleCobranzaModel = sequelize.define(
  "detalle_preventas",
  {
    iditem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idcobro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iddetalle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idfactura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nrofactura: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    emision: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vence: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    comprobante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amortiza: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    minteres: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    saldo: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    capital: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    importe_iva: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    mora: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    gastos_cobranzas: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    punitorio: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    moneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numerocuota: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cuota: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pago: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  },
  {
    tableName: "detalle_cobranzas", // 👈 Evita que Sequelize invente "configuracions"
    timestamps: true, // ✅ Agrega los campos `createdAt` y `updatedAt`
  }
);
