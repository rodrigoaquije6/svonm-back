import Venta from '../models/venta.js';
import Devolucion from '../models/devolucion.js';
import DetalleDevolucion from '../models/detalleDevolucion.js';
import Producto from '../models/producto.model.js';

const obtenerProximoCodigoDevolucion = async () => {
    try {
        // Buscar el último ingreso en la base de datos
        const ultimaDevolucion = await Devolucion.findOne({ codigo: { $regex: /^ONMD-\d{5}$/ } })
            .sort({ codigo: -1 })
            .exec();

        let proximoCodigoNumerico;
        if (!ultimaDevolucion) {
            proximoCodigoNumerico = 1;
        } else {
            // Extraer el número del código de la última venta
            const ultimoCodigoNumerico = parseInt(ultimaDevolucion.codigo.split('-')[1]);
            proximoCodigoNumerico = ultimoCodigoNumerico + 1;
        }
        
        // Formatear el próximo código de venta con ceros a la izquierda
        const proximoCodigo = `ONMD-${proximoCodigoNumerico.toString().padStart(5, '0')}`;
        return proximoCodigo;
    } catch (error) {
        throw new Error('Error al obtener el próximo código de la devolución');
    }
};

export const crearDevolucion = async (req, res) => {
    try {
        const codigoDevolucion = await obtenerProximoCodigoDevolucion();

        const {
            idVenta,
            motivo,
            observacion,
            total,
            idTrabajador,
            productosDevolucion
        } = req.body;

        // Verificar si la venta está finalizada
        const venta = await Venta.findById(idVenta);
        if (!venta || venta.estado !== 'Finalizada') {
            return res.status(400).json({ message: 'La venta debe estar finalizada para poder realizar una devolución' });
        }

        // Crear la devolución
        const devolucion = new Devolucion({
            codigo: codigoDevolucion,
            motivo,
            observacion,
            total,
            idVenta,
            idTrabajador
        });

        const savedDevolucion = await devolucion.save();

        // Crear los detalles de devolución
        const detallesDevolucionPromises = productosDevolucion.map(async producto => {
            const detalleDevolucion = new DetalleDevolucion({
                cantidad: producto.cantidad,
                idDevolucion: savedDevolucion._id,
                idProducto: producto._id,
            });
            await detalleDevolucion.save();

            // Incrementar el stock del producto devuelto
            const productoExistente = await Producto.findById(producto._id);
            productoExistente.stock += producto.cantidad;
            await productoExistente.save();
        });

        await Promise.all(detallesDevolucionPromises);

        // Actualizar el estado de la venta según el motivo de la devolución
        if (motivo === 'Cambio') {
            venta.estado = 'Cambio Solicitado';
        } else if (motivo === 'Reembolso') {
            venta.estado = 'Reembolsada';
        }
        await venta.save();

        res.status(201).json({ message: 'Devolución creada con éxito', devolucion: savedDevolucion });
    } catch (error) {
        console.error('Error al crear la devolución:', error);
        res.status(500).json({ message: 'Error al crear la devolución', error });
    }
};

export const obtenerDevoluciones = async (req, res) => {
    try {
        // Obtener todas las devoluciones
        const devoluciones = await Devolucion.find().populate('idVenta').populate('idTrabajador');

        // Para cada devolución, buscar sus detalles de devolución correspondientes
        const devolucionesConDetalles = await Promise.all(devoluciones.map(async (devolucion) => {
            const detallesDevolucion = await DetalleDevolucion.find({ idDevolucion: devolucion._id });
            return {
                devolucion,
                detallesDevolucion,
                detallesVenta
            };
        }));

        // Ahora, buscar los detalles de venta relacionados con la venta encontrada
        const detallesVenta = await DetalleVenta.find({ idVenta: Devolucion.idVenta._id }).populate('idProducto'); // Opcionalmente, puedes poblar los productos asociados a los detalles de venta

        res.status(200).json({ devolucionesConDetalles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las devoluciones', error:error.message });
    }
};

export const obtenerDevolucion = async (req, res) => {
    try {
        // Obtener el ID de la devolución desde los parámetros de la solicitud
        const { id } = req.params;

        // Buscar la devolución específica por su ID
        const devolucion = await Devolucion.findById(id).populate('idVenta').populate('idTrabajador');

        if (!devolucion) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        const detallesDevolucion = await DetalleDevolucion.find({ idDevolucion: devolucion._id });

        res.status(200).json({
            devolucion,
            detallesDevolucion
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la devolución', error: error.message });
    }
};

export const actualizarDevolucion = async (req, res) => {
    try {
        const devolucionId = req.params.id;
        const devolucionActualizada = req.body;

        const devolucionExistente = await Devolucion.findById(devolucionId);

        // Verificar si la devolución existe
        if (!devolucionExistente) {
            return res.status(404).json({ message: `La devolución con código ${devolucionExistente.codigo} no existe` });
        }

        // Actualizar los datos de la devolución
        await Devolucion.findByIdAndUpdate(devolucionId, devolucionActualizada, { new: true });

        res.status(200).json({ message: `Devolución con con código ${devolucionExistente.codigo} actualizada con éxito`, devolucion: devolucionActualizada });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la devolución', error });
    }
};