import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { VentasModel } from "../models/ventas";
import { DetalleVentasModel } from "../models/detalle_ventas";
import { ProductosModel } from "../models/productos";
import { ClienteModel } from "../models/clientes";
import { crearCuentaCliente, eliminarCuentaCliente } from "./cuenta_clientes";
import { CuentaClientesModel } from "../models/cuenta_clientes";
import { registrarAuditoria } from "../helpers/auditoria";
import { PreventaModel } from "../models/preventa";


// Obtener listado de ventas con nombre de cliente
export const getListadoVentas = async (req: Request, res: Response) => {
  const id = req.query.id;
  const desde = req.query.fechainicio;
  const hasta = req.query.fechafinal;

  try {
    const listapreventa = await sequelize.query(
      "SELECT idventa,formatofactura, fecha, c.nombre AS nombrecliente, totalneto " +
        "FROM cabecera_ventas p " +
        " LEFT JOIN clientes c " +
        " ON c.codigo = p.cliente " +
        " WHERE p.idusuario = ? " +
        " AND p.fecha BETWEEN ? AND ? " +
        " ORDER BY factura",
      { replacements: [id, desde, hasta], type: QueryTypes.SELECT }
    );

    res.json(listapreventa);
  } catch (error) {
    console.error("Error al obtener la lista de preventa:", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos" });
  }
};


//Crear una venta con detalles y cuenta cliente
// Esta función crea una venta y sus detalles, y también crea una cuenta cliente si es necesario
export const createVenta = async (req: Request, res: Response) => {
  const {
    creferencia,
    fecha,
    factura,
    formatofactura,
    vencimiento,
    cliente,
    sucursal,
    camion,
    moneda,
    comprobante,
    preventa,
    cotizacion,
    vendedor,
    caja,
    supago,
    sucambio,
    cuotas,
    exentas,
    gravadas10,
    gravadas5,
    totalneto,
    iniciovencetimbrado,
    vencimientotimbrado,
    nrotimbrado,
    idusuario,
    detalles,
  } = req.body;

  // Validación preliminar de los datos
  if (
    !creferencia ||
    !fecha ||
    !factura ||
    !detalles ||
    detalles.length === 0
  ) {
    console.error("Faltan datos requeridos para crear la venta.");
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  // Convertir el campo preventa a número y verificar si es válido
  const numeroPreventa = Number(preventa);

  // Crear una transacción para garantizar la consistencia de los datos
  const transaction = await sequelize.transaction();

  try {
    // 1. Crear la venta dentro de la transacción
    const venta = await VentasModel.create(
      {
        creferencia,
        fecha,
        factura,
        formatofactura,
        vencimiento,
        cliente,
        sucursal,
        camion,
        moneda,
        comprobante,
        preventa: numeroPreventa, // Usar el valor numérico
        cotizacion,
        vendedor,
        caja,
        supago,
        sucambio,
        cuotas,
        exentas,
        gravadas10,
        gravadas5,
        totalneto,
        iniciovencetimbrado,
        vencimientotimbrado,
        nrotimbrado,
        idusuario,
      },
      { transaction, returning: true }
    );

    // 2. Mapear y crear los detalles de la venta
    const detallesConNumero = detalles.map((detalle: any) => {
      const monto = parseFloat(detalle.precio) * parseInt(detalle.cantidad, 10);
      let impiva = 0;
      if (detalle.porcentaje === 5) {
        impiva = Math.ceil(monto / 21);
      } else if (detalle.porcentaje === 10) {
        impiva = Math.ceil(monto / 11);
      }

      const costo = parseFloat(detalle.costo);
      const prcosto = isNaN(costo) ? 0 : costo;

      return {
        idventadet: venta.getDataValue("idventa"),
        dreferencia: venta.getDataValue("creferencia"),
        codprod: detalle.codprod,
        cantidad: parseInt(detalle.cantidad, 10),
        prcosto: prcosto,
        precio: parseFloat(detalle.precio),
        monto,
        porcentaje: detalle.porcentaje,
        impiva,
        suc: venta.getDataValue("sucursal"),
      };
    });

    await DetalleVentasModel.bulkCreate(detallesConNumero, { transaction });

    // 3. Crear cuenta de cliente si es necesario
    if (comprobante > 1) {
      await crearCuentaCliente(
        {
          idventa: venta.getDataValue("idventa"),
          iddocumento: venta.getDataValue("creferencia"),
          creferencia: venta.getDataValue("creferencia"),
          documento: venta.getDataValue("factura"),
          fecha: venta.getDataValue("fecha"),
          vencimiento: venta.getDataValue("vencimiento"),
          cliente: venta.getDataValue("cliente"),
          sucursal: venta.getDataValue("sucursal"),
          moneda: venta.getDataValue("moneda"),
          vendedor: venta.getDataValue("vendedor"),
          caja: venta.getDataValue("caja"),
          importe: venta.getDataValue("totalneto"),
          numerocuota: 1,
          cuota: 1,
          saldo: venta.getDataValue("totalneto"),
        },
        transaction
      );
    }
    
    // 4. Si la venta proviene de una preventa (preventa > 0), actualizar el estado de la misma
    if (numeroPreventa > 0) {
      // Revertir a la búsqueda directa con el valor original
      const [filasAfectadas] = await PreventaModel.update(
        { cierre: 1 },
        {
          where: { numero: preventa }, // <-- Uso del valor original sin conversión explícita
          transaction,
        }
      );

      // Confirmar si la actualización tuvo éxito
      if (filasAfectadas > 0) {
        console.log(`✅ Cierre de preventa actualizado con éxito para el número ${preventa}. Filas afectadas: ${filasAfectadas}`);
      } else {
        console.log(`⚠️ Advertencia: No se encontró la preventa con número ${preventa} o el campo "cierre" ya tenía el valor 1.`);
      }
    }

    // 5. Commit de la transacción si todas las operaciones fueron exitosas
    await transaction.commit();
    console.log("✅ Transacción completada y venta creada.");

    // 6. Registrar la auditoría después del commit
    await registrarAuditoria({
      req,
      usuario: idusuario,
      accion: "crear",
      modulo: "Venta",
      idregistro: Number(venta.getDataValue("idventa")),
      datosDespues: { ...req.body },
    });

    // 7. Enviar la respuesta exitosa
    res.status(200).json({
      formatofactura: venta.getDataValue("formatofactura"),
      message: "Se Generó Factura N° " + venta.getDataValue("formatofactura"),
    });

  } catch (error) {
    // Si algo falla, hacer rollback de la transacción
    await transaction.rollback();
    console.error("❌ Transacción revertida debido a un error.");

    // Registrar el error y enviar una respuesta de error
    console.error("Error al crear venta:", error);
    res.status(500).json({
      message: "Error al crear Factura",
      error: error instanceof Error ? error.message : error,
    });
  }
};


// Obtener venta con sus detalles
export const getByFactura = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idventa = parseFloat(id);

  try {
    const venta = await VentasModel.findOne({
      where: { idventa },
      include: [
        {
          model: DetalleVentasModel,
          as: "detalles_venta",
          include: [
            {
              model: ProductosModel,
              as: "producto",
              attributes: ["codigo", ["nombre", "descripcion"]],
            },
          ],
        },
        {
          model: ClienteModel,
          as: "cliente_info",
          attributes: ["codigo", ["nombre", "nombrecliente"]],
        },
      ],
    });

    if (!venta) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    // Serializamos preventa a JSON plano
    const ventaJson = venta.toJSON() as any;

    res.status(200).json({
      idventa: ventaJson.idventa,
      factura: ventaJson.factura,
      formatofactura: ventaJson.formatofactura,
      creferencia: ventaJson.creferencia,
      vencimiento: ventaJson.vencimiento,
      sucursal: ventaJson.sucursal,
      preventa: ventaJson.preventa,
      camion: ventaJson.camion,
      moneda: ventaJson.moneda,
      cotizacion: ventaJson.cotizacion,
      vendedor: ventaJson.vendedor,
      caja: ventaJson.caja,
      supago: ventaJson.supago,
      sucambio: ventaJson.sucambio,
      cuotas: ventaJson.cuotas,
      exentas: ventaJson.exentas,
      gravadas10: ventaJson.gravadas10,
      gravadas5: ventaJson.gravadas5,
      totalneto: ventaJson.totalneto,
      iniciovencetimbrado: ventaJson.iniciovencetimbrado,
      vencimientotimbrado: ventaJson.vencimientotimbrado,
      nrotimbrado: ventaJson.nrotimbrado,
      idusuario: ventaJson.idusuario,
      fecha: ventaJson.fecha,
      comprobante: ventaJson.comprobante,
      cliente: ventaJson.cliente,
      clientenombre: ventaJson.cliente_info?.nombrecliente || "",
      detalles: ventaJson.detalles_venta,
    });
  } catch (error) {
    console.error("Error al obtener la Factura:", error);
    res.status(500).json({ message: "Error al obtener la Factura", error });
  }
};


// Actualizar una venta existente con detalles y cuenta cliente
export const updateVenta = async (req: Request, res: Response) => {
  const {
    idventa,
    creferencia,
    fecha,
    factura,
    formatofactura,
    vencimiento,
    cliente,
    sucursal,
    camion,
    moneda,
    comprobante,
    preventa, // Agrega el campo preventa
    cotizacion,
    vendedor,
    caja,
    supago,
    sucambio,
    cuotas,
    exentas,
    gravadas10,
    gravadas5,
    totalneto,
    iniciovencetimbrado,
    vencimientotimbrado,
    nrotimbrado,
    idusuario,
    detalles,
  } = req.body;

  // 1. Validar datos requeridos
  if (
    !idventa ||
    !creferencia ||
    !fecha ||
    !factura ||
    !detalles ||
    detalles.length === 0 ||
    !idusuario
  ) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  const transaction = await sequelize.transaction();

  try {
    // 2. Buscar la venta existente y los datos de la preventa
    const venta = await VentasModel.findByPk(idventa, { transaction });
    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const datosAntes = venta.get({ plain: true });

    // 3. Actualizar datos de la venta
    await venta.update(
      {
        creferencia, fecha, factura, formatofactura, vencimiento, cliente, sucursal, camion, moneda, comprobante,
        cotizacion, vendedor, caja, supago, sucambio, cuotas, exentas, gravadas10, gravadas5,
        totalneto, iniciovencetimbrado, vencimientotimbrado, nrotimbrado, idusuario, preventa
      },
      { transaction }
    );

    // 4. Actualizar detalles de venta (eliminar y recrear)
    await DetalleVentasModel.destroy({ where: { idventadet: idventa }, transaction });
    const nuevosDetalles = detalles.map((detalle: any) => {
      const cantidad = parseFloat(detalle.cantidad) || 0;
      const precio = parseFloat(detalle.precio) || 0;
      const costo = parseFloat(detalle.costo);
      const prcosto = isNaN(costo) ? 0 : costo;
      const porcentaje = parseFloat(detalle.porcentaje || detalle.ivaporcentaje || 0);
      const monto = cantidad * precio;
      let impiva = (porcentaje === 5) ? Math.ceil(monto / 21) : (porcentaje === 10) ? Math.ceil(monto / 11) : 0;
      
      return {
        idventadet: idventa, dreferencia: creferencia, codprod: detalle.codprod, cantidad, prcosto: prcosto,
        precio, monto, porcentaje, impiva, suc: sucursal
      };
    });
    await DetalleVentasModel.bulkCreate(nuevosDetalles, { transaction });

    // 5. Actualizar cuenta de cliente si aplica
    if (comprobante > 1) {
      await eliminarCuentaCliente(idventa, transaction);
      await crearCuentaCliente(
        { idventa, iddocumento: creferencia, creferencia, documento: factura, fecha, vencimiento, cliente,
          sucursal, moneda, vendedor, caja, importe: totalneto, numerocuota: 1, cuota: 1, saldo: totalneto },
        transaction
      );
    }

    // 6. Actualizar el estado de cierre de la preventa si se especifica
    const preventaAnterior = datosAntes.preventa;
    // Si la preventa ha cambiado, actualizar el estado de cierre
    if (preventa !== preventaAnterior) {
      // Revertir el cierre de la preventa anterior (si existía)
      if (preventaAnterior && preventaAnterior > 0) {
        const prevAnterior = await PreventaModel.findOne({ where: { numero: preventaAnterior }, transaction });
        if (prevAnterior) {
          await prevAnterior.update({ cierre: 0 }, { transaction });
          console.log(`✅ Cierre de preventa revertido para el número ${preventaAnterior}`);
        }
      }
      // Actualizar el cierre de la nueva preventa (si existe y es válida)
      if (preventa && preventa > 0) {
        const prevNueva = await PreventaModel.findOne({ where: { numero: preventa }, transaction });
        if (prevNueva) {
          await prevNueva.update({ cierre: 1 }, { transaction });
          console.log(`✅ Cierre de preventa actualizado para el número ${preventa}`);
        }
      }
    }

    // 7. Commit de la transacción
    await transaction.commit();
    res.status(200).json({ message: "Factura actualizada correctamente", formatofactura: venta.getDataValue("formatofactura") });

    // 8. Registrar la auditoría después del commit
    await registrarAuditoria({
      req,
      usuario: idusuario,
      accion: "modificación",
      modulo: "Venta",
      idregistro: Number(venta.getDataValue("idventa")),
      datosAntes,
      datosDespues: { ...req.body },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar venta:", error);
    res.status(500).json({
      message: "Error al actualizar Factura",
      error: error instanceof Error ? error.message : error,
    });
  }
};