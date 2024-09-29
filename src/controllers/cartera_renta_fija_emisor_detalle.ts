import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"

export const getCarteraRentaFijaEmisorDetallado = async (req: Request, res: Response) => {
    const id = req.query.id;
    const moneda = req.query.moneda;
    const emisor = req.query.emisor;
            
    const cartera = await sequelize.query("SELECT clientes.comitente,clientes.codigo,clientes.nombre,"
    +"titulos.nomalias,cartera_clientes.valor_nominal,cartera_clientes.tasa,"
    +"cartera_clientes.fechaemision,cartera_clientes.vencimiento,"
    +"emisor,emisores.nombre AS nombreemisor "
    +"FROM clientes "
    +"LEFT JOIN cartera_clientes "
    +"ON cartera_clientes.comprador = clientes.codigo "
    +"LEFT JOIN emisores "
    +"ON emisores.codigo=cartera_clientes.emisor "
    +"LEFT JOIN titulos "
    +"ON titulos.codigo=cartera_clientes.titulo "
    +"WHERE clientes.comitente= ?"
    +" AND cartera_clientes.operacion=1 "
    +" AND cartera_clientes.estado=1 "
    +" AND cartera_clientes.moneda= ?"
    +" AND cartera_clientes.emisor= ?"
    +" ORDER BY cartera_clientes.emisor,cartera_clientes.vencimiento ",{ replacements: [id,moneda,emisor], type: QueryTypes.SELECT })
    res.json(cartera)
    console.log(cartera);
}

//EJEMPLO DE CONSULTA
/*YourSequelizeModel.sequelize.query('SELECT * FROM YOURTABLE WHERE "COLUMN" = ? AND 
"PARAM"= ? ',{ replacements: [param1,param2], type: 
Sequelize.QueryTypes.SELECT } )*/


