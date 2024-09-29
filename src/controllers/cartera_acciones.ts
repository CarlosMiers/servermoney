import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"


export const getCarteraAcciones = async (req: Request, res: Response) => {
    const id = req.query.id;
    const moneda = req.query.moneda;
    
    const cartera = await sequelize.query("SELECT clientes.comitente,clientes.codigo,clientes.nombre,"
    +"SUM(cartera_clientes.valor_inversion) AS total,"
    +"emisor,emisores.nombre AS nombreemisor "
    +"FROM clientes "
    +"LEFT JOIN cartera_clientes "
    +"ON cartera_clientes.comprador = clientes.codigo "
    +"LEFT JOIN emisores "
    +"ON emisores.codigo=cartera_clientes.emisor "
    +"WHERE clientes.comitente= ?"
    +" AND cartera_clientes.operacion=2 "
    +" AND cartera_clientes.estado=1 "
    +" AND cartera_clientes.moneda= ?"
    +" GROUP BY cartera_clientes.emisor "
    +" ORDER BY emisores.nombre ",{ replacements: [id,moneda], type: QueryTypes.SELECT })
    res.json(cartera)
    console.log(cartera);
}

//EJEMPLO DE CONSULTA
/*YourSequelizeModel.sequelize.query('SELECT * FROM YOURTABLE WHERE "COLUMN" = ? AND 
"PARAM"= ? ',{ replacements: [param1,param2], type: 
Sequelize.QueryTypes.SELECT } )*/


