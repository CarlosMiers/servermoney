import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"

export const getCarteraAccionesDetallado = async (req: Request, res: Response) => {
    const id = req.query.id;
    const moneda = req.query.moneda;
    const emisor = req.query.emisor;
          
    const cartera = await sequelize.query("SELECT clientes.comitente,clientes.codigo,clientes.nombre,"
    +"titulos.nomalias,cartera_clientes.cantidad,cartera_clientes.precio,"
    +"cartera_clientes.fechacierre,cartera_clientes.valor_inversion,"
    +"emisor,emisores.nombre AS nombreemisor "
    +"FROM clientes "
    +"LEFT JOIN cartera_clientes "
    +"ON cartera_clientes.comprador = clientes.codigo "
    +"LEFT JOIN emisores "
    +"ON emisores.codigo=cartera_clientes.emisor "
    +"LEFT JOIN titulos "
    +"ON titulos.codigo=cartera_clientes.titulo "
    +"WHERE clientes.comitente= ?"
    +" AND cartera_clientes.operacion=2 "
    +" AND cartera_clientes.estado=1 "
    +" AND cartera_clientes.moneda= ?"
    +" AND cartera_clientes.emisor= ?"
    +" ORDER BY cartera_clientes.emisor,cartera_clientes.fechacierre ",{ replacements: [id,moneda,emisor], type: QueryTypes.SELECT })
    res.json(cartera)
    console.log(cartera);
}

//EJEMPLO DE CONSULTA
/*YourSequelizeModel.sequelize.query('SELECT * FROM YOURTABLE WHERE "COLUMN" = ? AND 
"PARAM"= ? ',{ replacements: [param1,param2], type: 
Sequelize.QueryTypes.SELECT } )*/


