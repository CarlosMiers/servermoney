import { Request, Response } from "express";
import { ProductosModel } from "../models/productos";


export const NewProducto = async (req: Request, res: Response) => {
  try {
    // Extraer la información del cuerpo de la solicitud
    const productoData = req.body;

    // Crear un nuevo producto en la base de datos
    const nuevoProducto = await ProductosModel.create(productoData);

    // Enviar una respuesta de éxito
    res.status(201).json({
      msg: 'El Producto fue agregado con éxito',
      producto: nuevoProducto
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Ups, ocurrió un error, comuníquese con soporte'
    });
  }
}


export const getIdProducto = async (req: Request, res: Response) => {
  const { codigo } = req.body;

  const producto: any = await ProductosModel.findOne({
    where: { codigo: codigo },
  });

  if (!producto) {
    return res.status(404).json({
      msg: `No existe un Producto con este código ${codigo}`,
    });
  }
  res.json(producto);
}

export const getTodosPaginado = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const producto = await ProductosModel.findAll({
      offset: offset,
      limit: limit,
    });

    res.json(producto);

  } catch (err) {
    res.status(500).json({ error: "NO SE PUDO CONECTAR" });
  }
}


export const getTodos = async (req: Request, res: Response) => {
  try {
    const producto = await ProductosModel.findAll({
      where: {
        estado: 1,
      },
    });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: "NO SE PUDO CONECTAR" });
  }
}

export const UpdateProductos = async (req: Request, res: Response) => {
  const codigo = req.body.codigo;
  try {
    const producto = await ProductosModel.findByPk(codigo?.toString());
    if (producto) {
      await producto.update(req.body);
      res.json({
        msg: 'El Producto fue actualizado con éxito'
      })

    } else {
      res.status(404).json({
        msg: `No existe el producto con id ${codigo}`
      })
    }

  } catch (error) {
    console.log(error);
    res.json({
      msg: `Upps ocurrio un error, comuniquese con soporte`
    })
  }
}
