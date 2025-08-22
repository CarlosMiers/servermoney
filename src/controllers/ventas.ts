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

export const createVenta01 = async (req: Request, res: Response) => {
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
    cotizacion,
    vendedor,
    caja,
    supago,
    sucambio,
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

  try {
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
        cotizacion,
        vendedor,
        caja,
        supago,
        sucambio,
        exentas,
        gravadas10,
        gravadas5,
        totalneto,
        iniciovencetimbrado,
        vencimientotimbrado,
        nrotimbrado,
        idusuario,
      },
      { returning: true }
    );
    // Crear cada detalle con el número de preventa

    const detallesConNumero = detalles.map((detalle: any) => {
      const monto = parseFloat(detalle.precio) * parseInt(detalle.cantidad); // Asumir que 'monto' es precio * cantidad
      let importeiva = 0;
      if (detalle.porcentaje === 5) {
        importeiva = Math.ceil(monto / 21);
      } else if (detalle.porcentaje === 10) {
        importeiva = Math.ceil(monto / 11);
      }
      return {
        idventadet: venta.getDataValue("idventa"),
        dreferencia: venta.getDataValue("creferencia"),
        codprod: detalle.codprod,
        cantidad: detalle.cantidad,
        prcosto: parseFloat(detalle.costo), // Convertir a número decimal
        precio: parseFloat(detalle.precio), // Convertir a número decimal
        monto: parseFloat(detalle.precio) * parseInt(detalle.cantidad), // Asumir que 'monto' es precio * cantidad
        porcentaje: detalle.porcentaje,
        impiva: importeiva,
        suc: venta.getDataValue("sucursal"),
      };
    });
    await DetalleVentasModel.bulkCreate(detallesConNumero);

    res.status(200).json({
      formatofactura: venta.getDataValue("formatofactura"),
      message: "Se Generó Factura N° " + venta.getDataValue("formatofactura"),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear Factura", error });
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
  // Validación preliminar de los datos (reemplazar con validaciones reales según el caso).
  if (
    !creferencia ||
    !fecha ||
    !factura ||
    !detalles ||
    detalles.length === 0
  ) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  // Crear una transacción para garantizar consistencia en la base de datos
  const transaction = await sequelize.transaction();

  try {
    // Crear la venta
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
        cotizacion,
        vendedor,
        caja,
        supago,
        sucambio,
        cuotas, // Aseguramos que 'cuotas' sea un campo opcional si no se usa
        exentas,
        gravadas10,
        gravadas5,
        totalneto,
        iniciovencetimbrado,
        vencimientotimbrado,
        nrotimbrado,
        idusuario,
      },
      { transaction, returning: true } // Aseguramos que el `idventa` se devuelva.
    );

    // Crear cada detalle con el número de preventa
    const detallesConNumero = detalles.map((detalle: any) => {
      const monto = parseFloat(detalle.precio) * parseInt(detalle.cantidad, 10); // Aseguramos que 'cantidad' sea un número entero

      // Calcular impuesto IVA según el porcentaje (suponiendo que son 5% o 10%).
      let impiva = 0;
      if (detalle.porcentaje === 5) {
        impiva = Math.ceil(monto / 21); // IVA 5%
      } else if (detalle.porcentaje === 10) {
        impiva = Math.ceil(monto / 11); // IVA 10%
      }

      return {
        idventadet: venta.getDataValue("idventa"),
        dreferencia: venta.getDataValue("creferencia"),
        codprod: detalle.codprod,
        cantidad: parseInt(detalle.cantidad, 10),
        prcosto: parseFloat(detalle.costo),
        precio: parseFloat(detalle.precio),
        monto,
        porcentaje: detalle.porcentaje,
        impiva,
        suc: venta.getDataValue("sucursal"),
      };
    });

    // Guardar detalles de venta en la base de datos
    await DetalleVentasModel.bulkCreate(detallesConNumero, { transaction });

    // Crear cuenta cliente si es necesario
    // Solo crear cuenta corriente si comprobante indica documento que genera saldo
    if (comprobante > 1) {
      await crearCuentaCliente(
        {
          idventa: venta.getDataValue("idventa"),
          iddocumento: venta.getDataValue("creferencia"), // Opcional: adaptar al código real de documento
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
          saldo: venta.getDataValue("totalneto"), // Asumimos que el saldo inicial es igual al importe total de la venta,
        },
        transaction
      );
    }

    // Commit de la transacción si todo fue exitoso

    await transaction.commit();

    // Enviar respuesta exitosa con el número de factura generado
    res.status(200).json({
      formatofactura: venta.getDataValue("formatofactura"),
      message: "Se Generó Factura N° " + venta.getDataValue("formatofactura"),
    });

    await registrarAuditoria({
      req,
      usuario: idusuario,
      accion: "crear",
      modulo: "Venta",
      idregistro: Number(venta.getDataValue("idventa")),
      datosDespues: { ...req.body },
    });

  } catch (error) {
    // Rollback de la transacción en caso de error
    await transaction.rollback();

    // Registrar el error para depuración
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

export const updateVenta = async (req: Request, res: Response) => {
  const {
    idventa, // Necesitamos este campo para identificar qué venta actualizar
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
    !idusuario // Es buena práctica validar también el usuario para la auditoría
  ) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  const transaction = await sequelize.transaction();

  try {
    // 2. Buscar la venta existente
    const venta = await VentasModel.findByPk(idventa, { transaction });
    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // 3. Actualizar datos de la venta
    await venta.update(
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
      { transaction }
    );

    // 4. Eliminar detalles anteriores de forma transaccional
    await DetalleVentasModel.destroy({
      where: { idventadet: idventa }, // Asumimos que `idventadet` es la clave foránea a `Ventas`
      transaction,
    });

    // 5. Crear nuevos detalles de forma transaccional
    const nuevosDetalles = detalles.map((detalle: any) => {
      const cantidad = parseFloat(detalle.cantidad) || 0;
      const precio = parseFloat(detalle.precio) || 0;
      const costo = parseFloat(detalle.costo || detalle.prcosto) || 0;
      const porcentaje = parseFloat(
        detalle.porcentaje || detalle.ivaporcentaje || 0
      );

      const monto = cantidad * precio;

      let impiva = 0;
      if (porcentaje === 5) {
        impiva = Math.ceil(monto / 21);
      } else if (porcentaje === 10) {
        impiva = Math.ceil(monto / 11);
      }

      return {
        idventadet: idventa,
        dreferencia: creferencia,
        codprod: detalle.codprod,
        cantidad,
        prcosto: costo,
        precio,
        monto,
        porcentaje,
        impiva,
        suc: sucursal,
      };
    });

    await DetalleVentasModel.bulkCreate(nuevosDetalles, { transaction });

    // 6. Eliminar la cuenta del cliente anterior y crear una nueva si aplica
    // Esta es la parte corregida: se ejecuta solo si el comprobante lo requiere
    if (comprobante > 1) {
      // Elimina la cuenta existente antes de crear la nueva
      await eliminarCuentaCliente(idventa, transaction);
      
      // Crea la nueva cuenta
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

    // 7. Si todo es correcto, hacer commit de la transacción
    await transaction.commit();
    res.status(200).json({
      message: "Factura actualizada correctamente",
      formatofactura: venta.getDataValue("formatofactura"),
    });

    // 8. Registrar la auditoría fuera de la transacción para evitar problemas
    await registrarAuditoria({
      req,
      usuario: idusuario,
      accion: "modificación",
      modulo: "Venta",
      idregistro: Number(venta.getDataValue("idventa")),
      datosDespues: { ...req.body },
    });


  } catch (error) {
    // En caso de error, hacer rollback de la transacción
    await transaction.rollback();
    console.error("Error al actualizar venta:", error);
    res.status(500).json({
      message: "Error al actualizar Factura",
      error: error instanceof Error ? error.message : error,
    });
  }
};
