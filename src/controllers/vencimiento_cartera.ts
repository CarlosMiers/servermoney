import { Request, Response } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import sequelize from "../db/connection"

export const getVencimientoCartera = async (req: Request, res: Response) => {
    const id = req.query.id;
    const moneda = req.query.moneda;
    const desde = req.query.fechainicio;
    const hasta = req.query.fechafinal;    
    console.log("id "+id);
    console.log("desde "+desde);
    console.log("hasta "+hasta);
    console.log("moneda "+moneda);

        
    const cartera = await sequelize.query("SELECT clientes.comitente,clientes.codigo,clientes.nombre,"
    +"titulos.nomalias,cartera_clientes.valor_nominal,cartera_clientes.tasa,"
    +"cartera_clientes.fechaemision,cartera_clientes.vencimiento,"
    +"emisor,emisores.nombre AS nombreemisor,"
    +"'PRINCIPAL' AS nombredocumento "
    +"FROM clientes "
    +"LEFT JOIN cartera_clientes "
    +"ON cartera_clientes.comprador = clientes.codigo "
    +"LEFT JOIN emisores "
    +"ON emisores.codigo=cartera_clientes.emisor "
    +"LEFT JOIN titulos "
    +"ON titulos.codigo=cartera_clientes.titulo "
    +"WHERE clientes.comitente= "+id
    +" AND cartera_clientes.operacion=1 "
    +"AND cartera_clientes.estado= 1 "
    +" AND cartera_clientes.moneda= "+moneda
    +" AND cartera_clientes.vencimiento BETWEEN '"+desde+"' AND '"+hasta+"'"
    +" UNION "
    +"SELECT clientes.comitente,clientes.codigo,clientes.nombre,"
    +"titulos.nomalias,cupones.valorfuturo AS valor_nominal,"
    +"cartera_clientes.tasa,cartera_clientes.fechaemision,"
    +"cupones.fechavencimiento AS vencimiento,"
    +"emisor,emisores.nombre AS nombreemisor,"
    +"'CUPON' AS nombredocumento  "
    +"FROM clientes "
    +"LEFT JOIN cartera_clientes "
    +" ON cartera_clientes.comprador = clientes.codigo "
    +"LEFT JOIN cupones "
    +"ON cupones.idprecierre=cartera_clientes.creferencia "
    +"LEFT JOIN emisores "
    +"ON emisores.codigo=cartera_clientes.emisor "
    +"LEFT JOIN titulos "
    +"ON titulos.codigo=cartera_clientes.titulo  "
    +" WHERE clientes.comitente =  "+id
    +" AND cartera_clientes.operacion=1 "
    +" AND cupones.estado=1 "
    +"AND cartera_clientes.moneda=  "+moneda
    +" AND cupones.fechavencimiento BETWEEN '"+desde+"' AND '"+hasta+"'"
    +" ORDER BY vencimiento ",{type: QueryTypes.SELECT })

    res.json(cartera)
    console.log(cartera);
}

//EJEMPLO DE CONSULTA
/*YourSequelizeModel.sequelize.query('SELECT * FROM YOURTABLE WHERE "COLUMN" = ? AND 
"PARAM"= ? ',{ replacements: [param1,param2], type: 
Sequelize.QueryTypes.SELECT } )*/


