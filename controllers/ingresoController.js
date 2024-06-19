import Ingreso from "../models/ingresos.js";
import DetalleIngreso from "../models/detalleIngreso.js";

const obtenerProximoCodigoIngreso = async () => {
    try {
        // Buscar el último ingreso en la base de datos
        const ultimoIngreso = await Ingreso.findOne().sort({ codigo: -1 }).exec();

        // Si no hay ingresos en la base de datos, comenzar desde 1
        if (!ultimoIngreso) {
            return 'ONMI-1';
        }

        // Extraer el número del código del último Ingreso
        const ultimoCodigoNumerico = parseInt(ultimoIngreso.codigo.split('-')[1]);

        // Construir el próximo código del ingreso
        const proximoCodigoNumerico = ultimoCodigoNumerico + 1;
        return `ONMI-${proximoCodigoNumerico}`;
    } catch (error) {
        throw new Error('Error al obtener el próximo código del ingreso');
    }
};

export const crearIngreso = async (req, res) => {
    try {

        const codigoIngreso = await obtenerProximoCodigoIngreso();

        const {
            observacion, descuento, impuesto, subtotal, total,
            fechaEntregaEstimada, estado, idProveedor, idTrabajador,
            productosAgregados
        } = req.body;

        // Crear el ingreso principal
        const ingreso = new Ingreso({
            codigo: codigoIngreso,
            observacion,
            descuento,
            impuesto,
            subtotal,
            total,
            fechaEntregaEstimada,
            estado,
            idProveedor,
            idTrabajador
        });

        const savedIngreso = await ingreso.save();

        // Crear los detalles del ingreso
        const detalleIngresoPromises = productosAgregados.map(producto => {
            const detalleIngreso = new DetalleIngreso({
                cantidad: producto.cantidad,
                total: producto.total,
                idIngreso: savedIngreso._id,
                idProducto: producto._id
            });
            return detalleIngreso.save();
        });

        // Ejecutar todas las promesas de detalles de ingreso
        await Promise.all(detalleIngresoPromises);

        res.status(201).json({ message: 'Ingreso creado con éxito', ingreso: savedIngreso });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el ingreso', error });
    }
};

export const obtenerIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.find().populate('idProveedor').populate('idTrabajador');

        const ingresosConDetalles = await Promise.all(ingresos.map(async (ingreso) => {
            const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingreso._id });
            return {
                ingreso,
                detallesIngreso
            };
        }));

        res.status(200).json({ ingresosConDetalles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los ingresos', error });
    }
};

export const obtenerIngreso = async (req, res) => {
    try {
        const { id } = req.params;

        const ingreso = await Ingreso.findById(id).populate('idProveedor').populate('idTrabajador');

        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }

        const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingreso._id });

        res.status(200).json({
            ingreso,
            detallesIngreso
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el ingreso', error });
    }
};

export const actualizarIngreso = async (req, res) => {
    try {
        const ingresoId = req.params.id;
        const ingresoActualizado = req.body;

        const ingresoExistente = await Ingreso.findById(ingresoId);

        if (!ingresoExistente) {
            return res.status(404).json({ message: `Ingreso con ID ${ingresoExistente.codigo} no encontrado` });
        }

        await Ingreso.findByIdandUpdate(ingresoId, ingresoActualizado, { new: true });

        res.status(200).json({ message: `Ingreso con ID ${ingresoExistente.codigo} actualizado con éxito`, ingreso: ingresoActualizado});
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el ingreso', error });
    }
};