import { Request, Response } from "express";
import { CajasModel } from "../models/cajas";

export const NewCaja = async (req: Request, res: Response) => {
  try {
    // Extraer la información del cuerpo de la solicitud
    const cajaData = req.body;

    // Crear un nuevo cliente en la base de datos
    const nuevaCaja = await CajasModel.create(cajaData);

    // Enviar una respuesta de éxito
    res.status(201).json({
      msg: "La Caja fue agregada con éxito",
      caja: nuevaCaja,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ups, ocurrió un error, comuníquese con soporte",
    });
  }
};

export const getIdCaja = async (req: Request, res: Response) => {
  const { codigo } = req.body;

  const caja: any = await CajasModel.findOne({
    where: { codigo: codigo },
  });

  if (!caja) {
    return res.status(404).json({
      msg: `No existe un Caja con este código ${codigo}`,
    });
  }
  res.json(caja);
};

export const getTodosAbecedario = async (req: Request, res: Response) => {
  try {
    // Recibimos los parámetros de paginación (por defecto página 1 y 10 resultados por página)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit; // Cálculo de desplazamiento (offset)

    // Contamos el total de registros en la base de datos
    const totalCajas = await CajasModel.count();

    // Realizamos la consulta con paginación
    const cajas = await CajasModel.findAll({
      offset: offset,
      limit: limit,
    });

    // Calculamos el total de páginas
    const totalPages = Math.ceil(totalCajas / limit);

    // Respondemos con los clientes y la información de la paginación
    res.json({
      cajas,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCajas,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo conectar" });
  }
};

export const getTodosPaginado = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cajas = await CajasModel.findAll({
      offset: offset,
      limit: limit,
    });

    res.json(cajas);
  } catch (err) {
    res.status(500).json({ error: "NO SE PUDO CONECTAR" });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const cajas = await CajasModel.findAll({
      where: { estado: 1 },
      attributes: ["codigo", "nombre", "expedicion", "factura"],
    });

    res.json(cajas);
  } catch (err) {
    res.status(500).json({ error: "NO SE PUDO CONECTAR" });
  }
};

export const UpdateCajas = async (req: Request, res: Response) => {
  const codigo = req.body.codigo;
  try {
    const cajas = await CajasModel.findByPk(codigo?.toString());
    if (cajas) {
      await cajas.update(req.body);
      res.json({
        msg: "La Caja fue actualizada con éxito",
      });
    } else {
      res.status(404).json({
        msg: `No existe la Caja con id ${codigo}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      msg: `Upps ocurrio un error, comuniquese con soporte`,
    });
  }
};

// Nueva función para actualizar solo el campo 'factura' de una caja
export const UpdateCajaFactura = async (req: Request, res: Response) => {
  const { codigo } = req.body; // Suponemos que el código es enviado en el body

  try {
    // Buscar la caja por el código
    const cajas = await CajasModel.findByPk(codigo?.toString());

    if (cajas) {
      // Obtener el valor actual de 'factura'
      // Sumamos 1 al valor de factura
      // Obtener el valor actual de 'factura' y convertirlo a número
      const facturaActual = parseInt(cajas.getDataValue("factura"), 10);

      if (isNaN(facturaActual)) {
        // Si la factura actual no es un número válido, devolver error
        return res.status(400).json({
          msg: "El valor de la factura no es válido.",
        });
      }

      // Sumamos 1 al valor de factura
      const nuevaFactura = facturaActual + 1;
      // Actualizamos el valor de 'factura'
      await cajas.update({ factura: nuevaFactura });

      res.json({
        msg: `La factura fue actualizada con éxito. Nueva factura: ${nuevaFactura}`,
      });
    } else {
      res.status(404).json({
        msg: `No existe la caja con id ${codigo}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Upps ocurrió un error, comuníquese con soporte",
    });
  }
};

//ACTUALIZAMOS EL TIPO DE IMPRESORA
export const UpdateCajaImpresora = async (req: Request, res: Response) => {
  const { codigo } = req.body; // Suponemos que el código es enviado en el body

  try {
    // Buscar la caja por el código
    const cajas = await CajasModel.findByPk(codigo?.toString());

    if (cajas) {
      // Obtener el valor actual de 'factura'
      // Sumamos 1 al valor de factura
      // Obtener el valor actual de 'factura' y convertirlo a número
      const impresora = cajas.getDataValue("impresorafactura");

      // Sumamos 1 al valor de factura
      // Actualizamos el valor de 'factura'
      await cajas.update({ impresoracaja: impresora });

      res.json({
        msg: `La Impresora actualizada con éxito. Nueva Impresora: ${impresora}`,
      });
    } else {
      res.status(404).json({
        msg: `No existe la caja con id ${codigo}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Upps ocurrió un error, comuníquese con soporte",
    });
  }
};
