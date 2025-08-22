// helpers/crearCuentaCliente.ts
import { CuentaClientesModel } from "../models/cuenta_clientes";
import { Op, Transaction } from "sequelize";
import { Request, Response } from "express";

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
    saldo: number;
  }>,
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
    throw new Error(
      `No se encontraron cuentas asociadas a la venta ${idventa}`
    );
  }

  // Podés eliminar en bloque si lo preferís
  await CuentaClientesModel.destroy({
    where: { idventa },
    transaction,
  });
};


export const consultarCuentasActivas = async (req: Request, res: Response) => {
  try {
    const { cliente, moneda } = req.query;

    const where: any = {
      saldo: { [Op.ne]: 0 },
    };

    if (cliente) {
      where.cliente = cliente;
    }

    if (moneda) {
      where.moneda = moneda;
    }

    const resultados = await CuentaClientesModel.findAll({
      where,
      order: [["vencimiento", "ASC"]],
    });

    // Envía los resultados como una respuesta JSON
    return res.status(200).json(resultados);

  } catch (error) {
    console.error('Error al consultar cuentas activas:', error);
    // En caso de error, envía una respuesta de error
    return res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
  }
};