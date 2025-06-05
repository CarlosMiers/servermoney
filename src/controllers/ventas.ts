import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";


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
