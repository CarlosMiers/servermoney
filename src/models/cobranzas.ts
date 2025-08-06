import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../db/connection";
import { DetalleCobranzaModel } from "./detalle_cobranzas";
import { ClienteModel } from "./clientes";

export const CobranzaModel = sequelize.define("cobranzas", {
  idcobro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idpagos: {
    type: DataTypes.STRING
  },
  numero: {
    type: DataTypes.NUMBER
  },
  sucursal: {
    type: DataTypes.INTEGER
  },
  cobrador: {
    type: DataTypes.INTEGER
  },
  fecha: {
    type: DataTypes.DATE
  },
  cliente: {
    type: DataTypes.INTEGER
  },
  
  moneda: {
    type: DataTypes.INTEGER
  },
  cotizacionmoneda: {
    type: DataTypes.DECIMAL
  },

  codusuario: {
    type: DataTypes.INTEGER
  },

  valores: {
    type: DataTypes.DECIMAL
  },
  totalpago: {
    type: DataTypes.DECIMAL
  },
  observacion: {
    type: DataTypes.STRING
  },
  asiento: {
    type: DataTypes.INTEGER
  },
  caja: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: "cobranzas", // 👈 Evita que Sequelize invente "configuracions"
  timestamps: true // ✅ Agrega los campos `createdAt` y `updatedAt`
});

CobranzaModel.hasMany(DetalleCobranzaModel, {
  foreignKey: "idcobro",
  sourceKey: "idcobro",
  as: "detalles",
});

DetalleCobranzaModel.belongsTo(CobranzaModel, {
  foreignKey: "idcobro",
  targetKey: "idcobro",
  as: "cobranza",
});

CobranzaModel.belongsTo(ClienteModel, {
  foreignKey: "cliente",
  targetKey: "codigo",
  as: "datosCliente",
});

ClienteModel.hasMany(CobranzaModel, {
  foreignKey: "cliente",
  sourceKey: "codigo",
  as: "cobranzas",
});