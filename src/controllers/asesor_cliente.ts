import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"


export const getAsesor = async (req: Request, res: Response) => {
    const id = req.query.id;
    console.log("IMPRIMIR ID "+id);
    const asesor = await sequelize.query("SELECT clientes.cedula,vendedores.celular "
    +"FROM clientes "
    +"LEFT JOIN vendedores "
    +"ON vendedores.codigo=clientes.asesor "
    +"WHERE clientes.cedula= ?"
    +" ORDER BY clientes.cedula ",{ replacements: [id], type: QueryTypes.SELECT })
    res.json(asesor)
    console.log(asesor);
}



