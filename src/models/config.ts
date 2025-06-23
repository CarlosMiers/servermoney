import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const ConfigModel = sequelize.define("configuracion", {
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ruc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fax: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  web: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ramo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
