import { Request, Response } from "express";
import { ClienteModel } from "../models/clientes";




export const NewCliente = async (req: Request, res: Response) => {
  try {
    // Extraer la información del cuerpo de la solicitud
     const clienteData = req.body;
     console.log(clienteData)

    // Crear un nuevo cliente en la base de datos
    const nuevoCliente = await ClienteModel.create(clienteData);

    // Enviar una respuesta de éxito
    res.status(201).json({
      msg: 'El Cliente fue agregado con éxito',
      cliente: nuevoCliente
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Ups, ocurrió un error, comuníquese con soporte'
    });
  }
}


export const getIdCliente = async (req: Request, res: Response) => {
  const { codigo }  = req.body;
  
  const cliente: any = await ClienteModel.findOne({
    where: { codigo: codigo },
  });

  if (!cliente) {
    return res.status(404).json({
      msg: `No existe un Cliente con este código ${codigo}`,
    });
  }
  res.json(cliente);
}

export const getTodos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const clientes = await ClienteModel.findAll({
      offset: offset,
      limit: limit,
    });

    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "NO SE PUDO CONECTAR" });
  }
}

export const UpdateClientes = async (req: Request, res: Response) => {
  const codigo = req.body.codigo;
  try {
      const cliente = await ClienteModel.findByPk(codigo?.toString());
      if (cliente) {
          await cliente.update(req.body);
          res.json({
              msg: 'El Cliente fue actualizado con éxito'
          })

      } else {
          res.status(404).json({
              msg: `No existe el cliente con id ${codigo}`
          })
      }

  } catch (error) {
      console.log(error);
      res.json({
          msg: `Upps ocurrio un error, comuniquese con soporte`
      })
  }

  
}
