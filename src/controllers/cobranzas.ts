import { Request, Response } from "express";
import { CobranzaModel } from "../models/cobranzas";
import { ClienteModel } from "../models/clientes";
import { Op } from "sequelize";

export const getCobranzasCabecera = async (req: Request, res: Response) => {
  const { idusuario, fechainicio, fechafinal } = req.query;
  console.log(req.query)

  if (!idusuario || !fechainicio || !fechafinal) {
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
        "cliente"
      ],
      where: {
        codusuario: idusuario, // 👈 solo muestra las cobranzas del usuario actual
        fecha: {
          // 👈 Sequelize.Op.between para rango de fechas
          [Op.between]: [new Date(fechainicio as string), new Date(fechafinal as string)]
        }
      },
      include: [
        {
          model: ClienteModel,
          as: "datosCliente",
          attributes: ["nombre"]
        }
      ],
      order: [["numero", "ASC"]]
    });

    res.json(cobranzas);
  } catch (error) {
    console.error("Error al obtener las cobranzas:", error);
    res.status(500).json({ error: "Error interno al consultar cobranzas" });
  }
};



