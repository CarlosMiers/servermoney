import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"


export const getTodos = async (req: Request, res: Response) => {
  const id = req.query.id;
  console.log("ID BUSCADO " + id);
  const ofertaop = await sequelize.query("SELECT ofertas.id,ofertas.emisor,"
    + "ofertas.moneda,ofertas.titulo,"
    + "ofertas.valor_inversion,"
    + "ofertas.validohasta,"
    + "ofertas.tasa,"
    + "titulos.nomalias AS nombretitulo,"
    + "emisores.nombre AS nombreemisor,"
    + "monedas.nombre AS nombremoneda,"
    + "ofertas.comentario "
    + "FROM ofertas "
    + "LEFT JOIN titulos "
    + "ON titulos.codigo=ofertas.titulo "
    + "LEFT JOIN monedas "
    + "ON monedas.codigo=ofertas.moneda "
    + "LEFT JOIN emisores "
    + "ON emisores.codigo=ofertas.emisor "
    + "WHERE  ofertas.renta = ? "
    + " AND ofertas.validohasta>=CURDATE() "
    + " AND ofertas.estado=1 "
    + " ORDER BY ofertas.id ", { replacements: [id], type: QueryTypes.SELECT })
  res.json(ofertaop)
  console.log(ofertaop);
}

