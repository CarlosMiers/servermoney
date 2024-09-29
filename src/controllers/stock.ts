import { Request, Response } from "express"
import { QueryTypes } from "sequelize"
import sequelize from "../db/connection";

export const getStockProducto = async (req: Request, res: Response) => {
    const id = req.query.id;
    console.log("IMPRIMIR ID " + id);

    const stockProd = await sequelize.query("SELECT sucursal,stock,"
        + "stock.producto,sucursales.nombre as nombresucursal "
        + "FROM stock "
        + "LEFT JOIN sucursales "
        + "ON sucursales.codigo=stock.sucursal "
        + "WHERE stock.producto= ? "
        + " ORDER BY stock.producto ", { replacements: [id], type: QueryTypes.SELECT })
    res.json(stockProd)
    console.log(stockProd);
}




