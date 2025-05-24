import { Request, Response } from "express";
import { PreventaModel } from "../models/preventa";
import { DetallePreventaModel } from "../models/detalle_preventa";
import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { ProductosModel } from "../models/productos";

// Crear una nueva preventa con detalles
export const create = async (req: Request, res: Response) => {
  const { fecha, comprobante, cliente, totalneto, codusuario, detalles } =
    req.body;

  try {
    const preventa = await PreventaModel.create(
      { fecha, comprobante, cliente, codusuario, totalneto },
      { returning: true }
    );
    // Crear cada detalle con el número de preventa

    const detallesConNumero = detalles.map((detalle: any) => ({
      iddetalle: preventa.getDataValue("numero"),
      codprod: detalle.codprod,
      cantidad: detalle.cantidad,
      prcosto: parseFloat(detalle.costo), // Convertir a número decimal
      precio: parseFloat(detalle.precio), // Convertir a número decimal
      monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad), // Asumir que 'monto' es precio * cantidad
      impiva: Math.round(
        (parseFloat(detalle.precio) * parseInt(detalle.cantidad)) / 11
      ), // Convertir a número decimal
      porcentaje: parseFloat(detalle.porcentaje), // Convertir a número decimal
    }));
    await DetallePreventaModel.bulkCreate(detallesConNumero);

    res.status(200).json({
      numero: preventa.getDataValue("numero"),
      message: "Se Generó Pedido N° " + preventa.getDataValue("numero"),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear preventa", error });
  }
};

// Actualizar una preventa y sus detalles
export const update = async (req: Request, res: Response) => {
  const {
    numeroPreventa,
    fecha,
    comprobante,
    cliente,
    totalneto,
    codusuario,
    detalles,
  } = req.body;

  try {
    // Buscar la preventa existente por su número
    const preventa = await PreventaModel.findOne({
      where: { numero: numeroPreventa },
    });

    if (!preventa) {
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    // Actualizar los datos de la preventa
    preventa.fecha = fecha;
    preventa.comprobante = comprobante;
    preventa.cliente = cliente;
    preventa.totalneto = totalneto;
    preventa.codusuario = codusuario; // Actualizar el campo codusuario

    // Guardamos la preventa con los nuevos datos
    await preventa.save();

    // Eliminar los detalles existentes y agregar los nuevos detalles
    await DetallePreventaModel.destroy({
      where: { iddetalle: preventa.numero }, // Eliminar detalles que corresponden a esta preventa
    });

    // Crear nuevos detalles
    const detallesConNumero = detalles.map((detalle: any) => ({
      iddetalle: preventa.numero,
      codprod: detalle.codprod,
      cantidad: detalle.cantidad,
      prcosto: parseFloat(detalle.costo), // Convertir a número decimal
      precio: parseFloat(detalle.precio), // Convertir a número decimal
      monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad), // Asumir que 'monto' es precio * cantidad
      impiva: Math.round(
        (parseFloat(detalle.precio) * parseInt(detalle.cantidad)) / 11
      ), // Convertir a número decimal
      porcentaje: parseFloat(detalle.porcentaje), // Convertir a número decimal
    }));

    // Insertar los nuevos detalles
    await DetallePreventaModel.bulkCreate(detallesConNumero);

    res.status(200).json({
      numero: preventa.numero,
      message: "Se actualizó el Pedido N° " + preventa.numero,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar preventa", error });
  }
};

// Obtener preventa con sus detalles
export const getByNumero = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numero = parseFloat(id);
  console.log("número:", numero);

  try {
    const preventa = await PreventaModel.findOne({
      where: { numero },
      include: [
        {
          model: DetallePreventaModel,
          as: "detalles",
          include: [
            {
              model: ProductosModel,
              as: "producto",
              attributes: ["codigo", ["nombre", "descripcion"]], // Especifica solo los campos que necesitas
            },
          ],
        },
      ],
    });

    if (!preventa) {
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    res.status(200).json({
      numero: preventa.numero,
      fecha: preventa.fecha,
      comprobante: preventa.comprobante,
      cliente: preventa.cliente,
      totalneto: preventa.totalneto,
      codusuario: preventa.codusuario,
      detalles: preventa.detalles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la preventa", error });
  }
};

export const getListadoPreventa = async (req: Request, res: Response) => {
  const id = req.query.id;
  const desde = req.query.fechainicio;
  const hasta = req.query.fechafinal;

  try {
    const listapreventa = await sequelize.query(
      "SELECT numero, fecha, c.nombre AS nombrecliente, totalneto " +
        "FROM preventa p " +
        " LEFT JOIN clientes c " +
        " ON c.codigo = p.cliente " +
        " WHERE p.codusuario = ? " +
        " AND p.fecha BETWEEN ? AND ? " +
        " ORDER BY numero",
      { replacements: [id, desde, hasta], type: QueryTypes.SELECT }
    );

    res.json(listapreventa);
  } catch (error) {
    console.error("Error al obtener la lista de preventa:", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos" });
  }
};
