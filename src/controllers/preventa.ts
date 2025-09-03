import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { PreventaModel } from "../models/preventa";
import { DetallePreventaModel } from "../models/detalle_preventa";
import { ProductosModel } from "../models/productos";
import { ClienteModel } from "../models/clientes";
import { registrarAuditoria } from "../helpers/auditoria";

// Crear una nueva preventa con detalles
export const create = async (req: Request, res: Response) => {
  const {
    fecha,
    vencimiento,
    comprobante,
    cliente,
    totalneto,
    codusuario,
    detalles,
  } = req.body;

  // Iniciar la transacción
  const transaction = await sequelize.transaction();

  try {
    // 1. Crear la cabecera de la preventa dentro de la transacción
    const preventa = await PreventaModel.create(
      { fecha, vencimiento, comprobante, cliente, codusuario, totalneto },
      { returning: true, transaction } // ¡Importante! Pasar la transacción aquí
    );

    // 2. Mapear los detalles para asociarlos con el número de preventa
    const detallesConNumero = detalles.map((detalle: any) => {
      // Convierte el costo a un número. Si el resultado es NaN, asigna 0.
      const costo = parseFloat(detalle.costo);
      const prcosto = isNaN(costo) ? 0 : costo;

      return {
        iddetalle: preventa.getDataValue("numero"),
        codprod: detalle.codprod,
        cantidad: detalle.cantidad,
        prcosto: prcosto, // Usamos el valor validado
        precio: parseFloat(detalle.precio),
        monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad),
        impiva: Math.round(
          (parseFloat(detalle.precio) * parseInt(detalle.cantidad)) / 11
        ),
        porcentaje: parseFloat(detalle.porcentaje),
      };
    });
    // 3. Insertar todos los detalles dentro de la misma transacción
    await DetallePreventaModel.bulkCreate(detallesConNumero, { transaction }); // ¡Importante! Pasar la transacción aquí

    // 4. Si todo lo anterior fue exitoso, confirmar la transacción
    await transaction.commit();

    // 5. Registrar la auditoría después del commit
    await registrarAuditoria({
      req,
      usuario: codusuario,
      accion: "creación",
      modulo: "Preventa",
      idregistro: Number(preventa.getDataValue("numero")),
      datosDespues: { ...req.body },
    });

    // 6. Enviar una respuesta exitosa al cliente
    res.status(200).json({
      numero: preventa.getDataValue("numero"),
      message: "Se Generó Pedido N° " + preventa.getDataValue("numero"),
    });
  } catch (error) {
    // Si algo falla, revertir todos los cambios de la transacción
    await transaction.rollback();
    res.status(500).json({ message: "Error al crear preventa", error });
  }
};

// Actualizar una preventa existente con detalles
export const update = async (req: Request, res: Response) => {
  // Desestructuración del id desde los parámetros de la solicitud
  const { id } = req.params;
  // Desestructuración de los datos del cuerpo de la solicitud
  const {
    fecha,
    vencimiento,
    comprobante,
    cliente,
    totalneto,
    codusuario,
    detalles,
  } = req.body;

  // Iniciar la transacción
  const transaction = await sequelize.transaction();

  try {
    // 1. Buscar la preventa existente dentro de la transacción
    const preventa = await PreventaModel.findOne({
      where: { numero: id },
      transaction, // Pasar la transacción
    });

    // Si no se encuentra la preventa, revertir la transacción y enviar una respuesta
    if (!preventa) {
      await transaction.rollback();
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    // Guardar los datos actuales para la auditoría antes de la modificación
    const datosAntes = { ...preventa.get({ plain: true }) };

    // 2. Actualizar los datos de la preventa dentro de la transacción
    await preventa.update(
      { fecha, vencimiento, comprobante, cliente, totalneto, codusuario },
      { transaction }
    );

    // 3. Eliminar los detalles existentes de esta preventa dentro de la transacción
    await DetallePreventaModel.destroy({
      where: { iddetalle: id },
      transaction, // Pasar la transacción
    });

    // 4. Mapear los nuevos detalles para asociarlos con la preventa

    const detallesConNumero = detalles.map((detalle: any) => {
      // Convierte el costo a un número. Si el resultado es NaN, asigna 0.
      const costo = parseFloat(detalle.costo);
      const prcosto = isNaN(costo) ? 0 : costo;

      return {
        iddetalle: id,
        codprod: detalle.codprod,
        cantidad: detalle.cantidad,
        prcosto: prcosto, // Usamos el valor validado
        precio: parseFloat(detalle.precio),
        monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad),
        impiva: Math.round(
          (parseFloat(detalle.precio) * parseInt(detalle.cantidad)) / 11
        ),
        porcentaje: parseFloat(detalle.porcentaje),
      };
    });

    // 5. Insertar los nuevos detalles dentro de la misma transacción
    await DetallePreventaModel.bulkCreate(detallesConNumero, { transaction });

    // 6. Si todas las operaciones fueron exitosas, confirmar la transacción
    await transaction.commit();

    // 7. Registrar la auditoría después del commit exitoso
    await registrarAuditoria({
      req,
      usuario: codusuario, // Usar el codusuario del body
      accion: "modificación",
      modulo: "Preventa",
      idregistro: Number(id),
      datosAntes,
      datosDespues: { ...req.body },
    });

    // 8. Enviar una respuesta exitosa al cliente
    res.status(200).json({
      numero: preventa.numero,
      message: "Se actualizó el Pedido N° " + preventa.numero,
    });
  } catch (error) {
    // Si algo falla, revertir todos los cambios de la transacción
    await transaction.rollback();
    console.error("Error al actualizar preventa:", error); // Agrega un log para depurar
    res.status(500).json({ message: "Error al actualizar preventa", error });
  }
};

// Obtener preventa con sus detalles
export const getByNumero = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numero = parseFloat(id);

  try {
    const preventa = await PreventaModel.findOne({
      where: { numero },
      include: [
        {
          model: DetallePreventaModel,
          as: "detalles_preventa",
          include: [
            {
              model: ProductosModel,
              as: "producto",
              attributes: ["codigo", ["nombre", "descripcion"]],
            },
          ],
        },
        {
          model: ClienteModel,
          as: "cliente_info",
          attributes: ["codigo", ["nombre", "nombrecliente"]],
        },
      ],
    });

    if (!preventa) {
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    // Serializamos preventa a JSON plano
    const preventaJson = preventa.toJSON() as any;

    res.status(200).json({
      numero: preventaJson.numero,
      fecha: preventaJson.fecha,
      vencimiento: preventaJson.vencimiento,
      comprobante: preventaJson.comprobante,
      cliente: preventaJson.cliente,
      clientenombre: preventaJson.cliente_info?.nombrecliente || "",
      totalneto: preventaJson.totalneto,
      codusuario: preventaJson.codusuario,
      detalles: preventaJson.detalles_preventa,
    });
  } catch (error) {
    console.error("Error al obtener la preventa:", error);
    res.status(500).json({ message: "Error al obtener la preventa", error });
  }
};

export const getListadoPreventa = async (req: Request, res: Response) => {
  const id = req.query.id;
  const desde = req.query.fechainicio;
  const hasta = req.query.fechafinal;

  try {
    const listapreventa = await sequelize.query(
      "SELECT numero, fecha,vencimiento,c.nombre AS nombrecliente, totalneto " +
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

export const getListadoPreventaActivos = async (
  req: Request,
  res: Response
) => {
  try {
    const listapreventa = await sequelize.query(
      "SELECT numero, fecha,vencimiento,c.nombre AS nombrecliente, totalneto " +
        "FROM preventa p " +
        " LEFT JOIN clientes c " +
        " ON c.codigo = p.cliente " +
        " WHERE p.cierre = 0 " +
        " ORDER BY numero",
      { type: QueryTypes.SELECT }
    );

    res.json(listapreventa);
  } catch (error) {
    console.error("Error al obtener la lista de preventas activas", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos" });
  }
};
