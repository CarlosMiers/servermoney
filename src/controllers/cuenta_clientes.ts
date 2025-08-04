// helpers/crearCuentaCliente.ts
import { CuentaClientesModel } from "../models/cuenta_clientes";
import { Op, Transaction } from "sequelize";

export const crearCuentaCliente = async (
  data: {
    idventa?: number;
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
    numerocuota?: number;
    cuota?: number;
    saldo?: number;
  },
  transaction?: Transaction
) => {
  return await CuentaClientesModel.create(data, { transaction });
};


export const modificarCuentaCliente = async (
  idventa: number,
  nuevosDatos: Partial<{
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
    saldo: number;}>,
  transaction?: Transaction
) => {
  const cuenta = await CuentaClientesModel.findByPk(idventa);
  if (!cuenta) throw new Error("Cuenta no encontrada");

  return await cuenta.update(nuevosDatos, { transaction });
};

export const eliminarCuentaCliente = async (
  idventa: number,
  transaction?: Transaction
) => {
  const cuentas = await CuentaClientesModel.findAll({
    where: { idventa },
    transaction,
  });

  if (!cuentas || cuentas.length === 0) {
    throw new Error(`No se encontraron cuentas asociadas a la venta ${idventa}`);
  }

  // Podés eliminar en bloque si lo preferís
  await CuentaClientesModel.destroy({
    where: { idventa },
    transaction,
  });
};



export const consultarCuentasActivas = async (cliente?: string) => {
  const where: any = {
    saldo: { [Op.ne]: 0 } // Saldos distintos de cero (positivos o negativos)
  };

  if (cliente) {
    where.cliente = cliente;
  }

  return await CuentaClientesModel.findAll({
    where,
    order: [["vencimiento", "ASC"]]
  });
};