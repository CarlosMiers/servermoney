import { Request, Response } from "express";
import { PreventaModel } from "../models/preventa";
import { DetallePreventaModel } from "../models/detalle_preventa";
import { QueryTypes } from "sequelize"
import sequelize from "../db/connection";

// Crear una nueva preventa con detalles
export const create = async (req: Request, res: Response) => {
  const { fecha, comprobante, cliente, total, detalles } = req.body;

  try {
    const preventa = await PreventaModel.create(
      { fecha, comprobante, cliente, total },
      { returning: true }
    );

    // Crear cada detalle con el número de preventa
    const detallesConNumero = detalles.map((detalle: any) => ({
      ...detalle,
      numero: preventa.getDataValue("numero"), // Asigna el número de la cabecera
    }));

    await DetallePreventaModel.bulkCreate(detallesConNumero);

    res.status(201).json({ message: "Preventa creada con detalles", preventa });
  } catch (error) {
    res.status(500).json({ message: "Error al crear preventa", error });
  }
};

// Actualizar una preventa y sus detalles
export const update = async (req: Request, res: Response) => {
  const { numero } = req.params;
  const { fecha, comprobante, cliente, total, detalles } = req.body;

  try {
    const preventa = await PreventaModel.findByPk(numero);
    if (!preventa) {
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    await preventa.update({ fecha, comprobante, cliente, total });

    // Eliminar detalles existentes y agregar los nuevos detalles
    await DetallePreventaModel.destroy({ where: { numero } });
    const detallesConNumero = detalles.map((detalle: any) => ({
      ...detalle,
      numero, // Asigna el número de la cabecera
    }));
    await DetallePreventaModel.bulkCreate(detallesConNumero);

    res
      .status(200)
      .json({ message: "Preventa y detalles actualizados", preventa });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar preventa", error });
  }
};

// Obtener preventa con sus detalles
export const getByNumero = async (req: Request, res: Response) => {
  const { numero } = req.params;

  try {
    const preventa = await PreventaModel.findOne({
      where: { numero },
      include: [DetallePreventaModel], // Incluye los detalles
    });

    if (!preventa) {
      return res.status(404).json({ message: "Preventa no encontrada" });
    }

    res.status(200).json(preventa);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener preventa", error });
  }
}




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
      " ORDER BY numero",{ replacements: [id,desde,hasta], type: QueryTypes.SELECT });
  
    res.json(listapreventa);
  } catch (error) {
    console.error("Error al obtener la lista de preventa:", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos" });
  }
  
}