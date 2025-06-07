import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { VentasModel } from "../models/ventas";
import { DetalleVentasModel } from "../models/detalle_ventas";

export const getListadoVentas = async (req: Request, res: Response) => {
  const id = req.query.id;
  const desde = req.query.fechainicio;
  const hasta = req.query.fechafinal;

  try {
    const listapreventa = await sequelize.query(
      "SELECT idventa,formatofactura, fecha, c.nombre AS nombrecliente, totalneto " +
        "FROM cabecera_ventas p " +
        " LEFT JOIN clientes c " +
        " ON c.codigo = p.cliente " +
        " WHERE p.idusuario = ? " +
        " AND p.fecha BETWEEN ? AND ? " +
        " ORDER BY factura",
      { replacements: [id, desde, hasta], type: QueryTypes.SELECT }
    );

    res.json(listapreventa);
  } catch (error) {
    console.error("Error al obtener la lista de preventa:", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos" });
  }
};

export const createVenta = async (req: Request, res: Response) => {
  const {
    creferencia,
    fecha,
    factura,
    formatofactura,
    vencimiento,
    cliente,
    sucursal,
    moneda,
    comprobante,
    vendedor,
    camion,
    caja,
    exentas,
    gravadas5,
    gravadas10,
    totalneto,
    iniciovencetimbrado,
    vencimientotimbrado,
    nrotimbrado,
    detalles,
  } = req.body;

  console.log("Cabecera venta:", req.body);

  console.log("Detalles de la venta:", detalles);
  try {
    const venta = await VentasModel.create(
      {
        creferencia,
        fecha,
        factura,
        formatofactura,
        vencimiento,
        cliente,
        sucursal,
        moneda,
        comprobante,
        vendedor,
        camion,
        caja,
        exentas,
        gravadas5,
        gravadas10,
        totalneto,
        iniciovencetimbrado,
        vencimientotimbrado,
        nrotimbrado
      },
      { returning: true }
    );
    // Crear cada detalle con el número de preventa

  const detallesConNumero = detalles.map((detalle: any) => {
    const monto = parseFloat(detalle.precio) * parseInt(detalle.cantidad); // Asumir que 'monto' es precio * cantidad
    let impiva = 0;
    if (detalle.porcentaje === 5) {
      impiva = Math.ceil(monto / 21);
    } else if (detalle.porcentaje === 10) {
      impiva = Math.ceil(monto / 11);
    }
    return {
      idventadet: venta.getDataValue("idventa"),
      dreferencia: venta.getDataValue("creferencia"),
      codprod: detalle.codprod,
      cantidad: detalle.cantidad,
      prcosto: parseFloat(detalle.costo), // Convertir a número decimal
      precio: parseFloat(detalle.precio), // Convertir a número decimal
      monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad), // Asumir que 'monto' es precio * cantidad
      porcentaje: detalle.porcentaje,
      impiva: impiva,
      suc: venta.getDataValue("sucursal"),
    };
  });
    await DetalleVentasModel.bulkCreate(detallesConNumero);

    res.status(200).json({
      formatofactura: venta.getDataValue("formatofactura"),
      message: "Se Generó Factura N° " + venta.getDataValue("formatofactura"),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear Factura", error });
  }
};
