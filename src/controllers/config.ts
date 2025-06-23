import { Request, Response } from "express";
import { ConfigModel } from "../models/config";

export const getConfig = async (req: Request, res: Response) => {
  try {
    // Obtenemos la configuración de la base de datos
    const config = await ConfigModel.findOne();

    if (!config) {
      return res.status(404).json({
        msg: "No se encontró la configuración",
      });
    }

    // Respondemos con la configuración
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Ups, ocurrió un error, comuníquese con soporte",
    });
  }
};
