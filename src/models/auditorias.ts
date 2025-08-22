import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const AuditoriaModel = sequelize.define("auditorias", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idregistro: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  datos_antes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  datos_despues: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "web",
  },
  fecha_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "auditorias",
  timestamps: false,
});