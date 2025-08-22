// helpers/auditoria.ts
import { Request } from "express";
import { AuditoriaModel } from "../models/auditorias";

interface AuditoriaParams {
  req: Request;
  usuario: string;
  accion: string;
  modulo: string;
  idregistro?: number;
  datosAntes?: any;
  datosDespues?: any;
  origen?: string;
}

export const registrarAuditoria = async ({
  req,
  usuario,
  accion,
  modulo,
  idregistro,
  datosAntes,
  datosDespues,
  origen = "web",
}: AuditoriaParams) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "desconocido";
    const userAgent = req.headers["user-agent"] || "desconocido";

    await AuditoriaModel.create({
      usuario,
      accion,
      modulo,
      idregistro,
      datos_antes: datosAntes || null,
      datos_despues: datosDespues || null,
      ip: typeof ip === "string" ? ip : Array.isArray(ip) ? ip[0] : "desconocido",
      user_agent: userAgent,
      origen,
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
    // Podés guardar el error en otro log si querés
  }
};