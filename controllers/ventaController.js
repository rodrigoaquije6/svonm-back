import DetalleTratamiento from "../models/detalleTratamiento.js";
import DetalleVenta from "../models/detalleVenta.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.js";

const obtenerProximoCodigoVenta = async () => {
  try {
    // Buscar la última venta en la base de datos
    const ultimaVenta = await Venta.findOne().sort({ codigo: -1 }).exec();

    // Si no hay ventas en la base de datos, comenzar desde 1
    if (!ultimaVenta) {
      return 'ONMV-1';
    }

    // Extraer el número del código de la última venta
    const ultimoCodigoNumerico = parseInt(ultimaVenta.codigo.split('-')[1]);

    // Construir el próximo código de venta
    const proximoCodigoNumerico = ultimoCodigoNumerico + 1;
    return `ONMV-${proximoCodigoNumerico}`;
  } catch (error) {
    throw new Error('Error al obtener el próximo código de venta');
  }
};

export const crearVenta = async (req, res) => {
  try {

    const codigoVenta = await obtenerProximoCodigoVenta();

    const {
      oDEsfera, oDCilindro, oDEje, oDAvLejos, oDAvCerca, oDAdd, oDAltura, oDCurva,
      oIEsfera, oICilindro, oIEje, oIAvLejos, oIAvCerca, oIAdd, oIAltura, oICurva,
      dipLejos, dipCerca, observacion, aCuenta, saldo, total, estado,
      idCliente, idTrabajador, idTipoLuna, idMaterialLuna,
      productosAgregados, tratamientosAgregados
    } = req.body;

    // Verificar el stock antes de realizar la venta
    for (const producto of productosAgregados) {
      const productoExistente = await Producto.findById(producto._id);
      if (!productoExistente) {
        return res.status(404).json({
          message: `El producto con ID ${producto._id} no existe`
        });
      }
      if (productoExistente.stock < producto.cantidad) {
        return res.status(400).json({
          message: `No hay suficiente stock para realizar la venta del producto ${productoExistente.nombre}`
        });
      }
    }

    // Crear la venta
    const venta = new Venta({
      codigo: codigoVenta, oDEsfera, oDCilindro, oDEje, oDAvLejos, oDAvCerca, oDAdd, oDAltura, oDCurva,
      oIEsfera, oICilindro, oIEje, oIAvLejos, oIAvCerca, oIAdd, oIAltura, oICurva,
      dipLejos, dipCerca, observacion, aCuenta, saldo, total, estado,
      idCliente, idTrabajador, idTipoLuna, idMaterialLuna
    });

    const savedVenta = await venta.save();

    // Actualizar el stock después de la venta
    for (const producto of productosAgregados) {
      const productoExistente = await Producto.findById(producto._id);
      productoExistente.stock -= producto.cantidad;
      await productoExistente.save();
    }

    // Crear los detalles de venta
    const detalleVentasPromises = productosAgregados.map(producto => {
      const detalleVenta = new DetalleVenta({
        cantidad: producto.cantidad,
        total: producto.total,
        idVenta: savedVenta._id,
        idProducto: producto._id
      });
      return detalleVenta.save();
    });

    // Crear los detalles de tratamiento
    const detalleTratamientosPromises = tratamientosAgregados.map(tratamiento => {
      const detalleTratamiento = new DetalleTratamiento({
        idTratamiento: tratamiento._id,
        idVenta: savedVenta._id
      });
      return detalleTratamiento.save();
    });

    // Ejecutar todas las promesas
    await Promise.all([...detalleVentasPromises, ...detalleTratamientosPromises]);

    res.status(201).json({ message: 'Venta creada con éxito', venta: savedVenta });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
};

export const obtenerVentas = async (req, res) => {
  try {
    // Obtener todas las ventas
    const ventas = await Venta.find().populate('idCliente').populate('idTrabajador');

    // Para cada venta, buscar sus detalles de venta correspondientes
    const ventasConDetalles = await Promise.all(ventas.map(async (venta) => {
      const detallesVenta = await DetalleVenta.find({ idVenta: venta._id });
      const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id });
      return {
        venta,
        detallesVenta,
        detallesTratamiento
      };
    }));

    res.status(200).json({ ventasConDetalles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};

export const obtenerVenta = async (req, res) => {
  try {
    // Obtener el ID de la venta desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar la venta específica por su ID
    const venta = await Venta.findById(id).populate('idCliente').populate('idTrabajador');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const detallesVenta = await DetalleVenta.find({ idVenta: venta._id });
    const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id });

    res.status(200).json({
      venta,
      detallesVenta,
      detallesTratamiento
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta', error });
  }
};

export const actualizarVenta = async (req, res) => {
  try {
    const ventaId = req.params.id; // Obtener el ID de la venta de los parámetros de la solicitud
    const ventaActualizada = req.body; // Obtener los datos actualizados de la venta del cuerpo de la solicitud

    const ventaExistente = await Venta.findById(ventaId);

    // Verificar si la venta existe
    if (!ventaExistente) {
      return res.status(404).json({ message: `La venta con código ${ventaExistente.codigo} no existe` });
    }

    // Actualizar los datos de la venta
    await Venta.findByIdAndUpdate(ventaId, ventaActualizada, { new: true });

    res.status(200).json({ message: `Venta con con código ${ventaExistente.codigo} actualizada con éxito`, venta: ventaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta', error });
  }
};