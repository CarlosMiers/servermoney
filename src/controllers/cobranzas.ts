import { Request, Response } from "express";
import { CobranzaModel } from "../models/cobranzas";
import { ClienteModel } from "../models/clientes";
import { Op } from "sequelize";
import { DetalleCobranzaModel } from "../models/detalle_cobranzas";
import sequelize from "../db/connection";
import { registrarAuditoria } from "../helpers/auditoria";

export const getCobranzasCabecera = async (req: Request, res: Response) => {
  const { id, fechainicio, fechafinal } = req.query;
  console.log(req.query);

  if (!id || !fechainicio || !fechafinal) {
    return res.status(400).json({ error: "Faltan parámetros necesarios" });
  }

  try {
    const cobranzas = await CobranzaModel.findAll({
      attributes: [
        "idcobro",
        "numero",
        "fecha",
        "moneda",
        "totalpago",
        "observacion",
        "cliente",
      ],
      where: {
        codusuario: id, // 👈 solo muestra las cobranzas del usuario actual
        fecha: {
          // 👈 Sequelize.Op.between para rango de fechas
          [Op.between]: [
            new Date(fechainicio as string),
            new Date(fechafinal as string),
          ],
        },
      },
      include: [
        {
          model: ClienteModel,
          as: "datosCliente",
          attributes: ["nombre"],
        },
      ],
      order: [["numero", "ASC"]],
    });

    res.json(cobranzas);
  } catch (error) {
    console.error("Error al obtener las cobranzas:", error);
    res.status(500).json({ error: "Error interno al consultar cobranzas" });
  }
};

//crear cobranza
export const crearCobranza = async (req: Request, res: Response) => {
  const {
    numero,
    idpagos,
    sucursal,
    cobrador,
    fecha,
    cliente,
    moneda = 1,
    cotizacionmoneda = 1,
    codusuario,
    valores,
    totalpago,
    observacion,
    asiento,
    caja,
    detalles = [],
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Crear cobranza principal
    const nuevaCobranza = await CobranzaModel.create(
      {
        numero,
        idpagos,
        sucursal,
        cobrador,
        fecha,
        cliente,
        moneda,
        cotizacionmoneda,
        codusuario,
        valores,
        totalpago,
        observacion,
        asiento,
        caja,
      },
      { transaction }
    );

    const idcobro = nuevaCobranza.getDataValue("idcobro");

    // Mapear detalles
    const detallesMapeados = detalles.map((detalle: any) => ({
      idcobro: idcobro,
      iddetalle: nuevaCobranza.getDataValue("idpagos"),
      idfactura: detalle.idfactura,
      nrofactura: detalle.nrofactura,
      emision: detalle.emision,
      comprobante: detalle.comprobante,
      pago: parseFloat(detalle.pago || 0),
      saldo: parseFloat(detalle.pago || 0),
      capital: parseFloat(detalle.capital || 0),
      diamora: parseFloat(detalle.diamora || 0),
      mora: parseFloat(detalle.mora || 0),
      gastos_cobranzas: parseFloat(detalle.gastos_cobranzas || 0),
      moneda: detalle.moneda || 1,
      amortiza: parseFloat(detalle.amortiza || 0),
      minteres: parseFloat(detalle.minteres || 0),
      vence: detalle.vence,
      acreedor: detalle.acreedor,
      cuota: detalle.cuota,
      numerocuota: detalle.numerocuota,
      importe_iva: parseFloat(detalle.importe_iva || 0),
      punitorio: parseFloat(detalle.punitorio || 0),
      fechacobro: nuevaCobranza.getDataValue("fecha"),
    }));

    // Crear detalles en bloque
    await DetalleCobranzaModel.bulkCreate(detallesMapeados, { transaction });
    // Confirmar transacción
    await transaction.commit();
    // Enviar respuesta

    res.status(200).json({
      formatorecibo: nuevaCobranza.getDataValue("numero"),
      message: "Se Generó Recibo N° " + nuevaCobranza.getDataValue("numero"),
    });

    await registrarAuditoria({
      req,
      usuario: codusuario,
      accion: "crear",
      modulo: "Cobranza",
      idregistro: Number(idcobro),
      datosDespues: { ...req.body },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear cobranza:", error);
    res.status(500).json({
      ok: false,
      error: "No se pudo registrar la cobranza",
    });

    // Registrar auditoría
  }
};

//modificar cobranza
export const modificarCobranza = async (req: Request, res: Response) => {
  const { idcobro } = req.params;
  const {
    numero,
    idpagos,
    sucursal,
    cobrador,
    fecha,
    cliente,
    moneda,
    cotizacionmoneda,
    codusuario,
    valores,
    totalpago,
    observacion,
    asiento,
    caja,
    detalles = [],
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const cobranza = await CobranzaModel.findByPk(idcobro);
    if (!cobranza) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        error: "Cobranza no encontrada",
      });
    }

    const datosAntes = cobranza.toJSON();

    // Actualizar cobranza principal
    await cobranza.update(
      {
        numero,
        idpagos,
        sucursal,
        cobrador,
        fecha,
        cliente,
        moneda,
        cotizacionmoneda,
        codusuario,
        valores,
        totalpago,
        observacion,
        asiento,
        caja,
      },
      { transaction }
    );

    // Eliminar detalles anteriores
    await DetalleCobranzaModel.destroy({ where: { idcobro }, transaction });

    // Mapear nuevos detalles
    const detallesMapeados = detalles.map((detalle: any) => ({
      idcobro: idcobro,
      iddetalle: idpagos || null, // Si no hay iddetalle, se puede dejar como null
      idfactura: detalle.idfactura,
      nrofactura: detalle.nrofactura,
      emision: detalle.emision,
      comprobante: detalle.comprobante,
      pago: parseFloat(detalle.pago || 0),
      capital: parseFloat(detalle.capital || 0),
      diamora: parseFloat(detalle.diamora || 0),
      mora: parseFloat(detalle.mora || 0),
      gastos_cobranzas: parseFloat(detalle.gastos_cobranzas || 0),
      moneda: detalle.moneda || 1,
      amortiza: parseFloat(detalle.amortiza || 0),
      minteres: parseFloat(detalle.minteres || 0),
      vence: detalle.vence,
      acreedor: detalle.acreedor,
      cuota: detalle.cuota,
      numerocuota: detalle.numerocuota,
      importe_iva: parseFloat(detalle.importe_iva || 0),
      punitorio: parseFloat(detalle.punitorio || 0),
      fechacobro: fecha,
    }));

    // Crear nuevos detalles
    await DetalleCobranzaModel.bulkCreate(detallesMapeados, { transaction });

    // Confirmar transacción
    await transaction.commit();

    // Enviar respuesta
    res.json({
      ok: true,
      mensaje: "Cobranza actualizada correctamente",
    });

    // Registrar auditoría
    await registrarAuditoria({
      req,
      usuario: codusuario,
      accion: "modificar",
      modulo: "Cobranza",
      idregistro: Number(idcobro),
      datosAntes,
      datosDespues: { ...req.body },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al modificar cobranza:", error);
    res.status(500).json({
      ok: false,
      error: "No se pudo actualizar la cobranza",
    });
  }
};
