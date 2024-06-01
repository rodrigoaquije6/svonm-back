import Producto from "../models/producto.model.js";
import Montura from "../models/Montura.js";
import LentesSol from "../models/LentesSol.js";
import TipoProducto from "../models/TipoProducto.js";
import Marca from "../models/Crear-marca.js";

import mongoose from 'mongoose';

export const crearProducto = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { codigo, tipoProducto, nombre, precio, imagen, marca, ...rest } = req.body;

        // Obtener el documento del tipo de producto
        const tipoProductoDoc = await TipoProducto.findOne({ nombre: tipoProducto });

        // Obtener el documento de la marca
        const marcaDoc = await Marca.findOne({ nombre: marca });

        // Crear el producto base
        const producto = new Producto({
            codigo,
            tipoProducto: tipoProductoDoc._id,
            nombre,
            precio,
            imagen,
            marca: marcaDoc._id,
        });

        await producto.save({ session });

        let productoEspecifico;

        // Crear el tipo específico de producto
        if (tipoProducto === 'Montura') {
            productoEspecifico = new Montura({
                productoId: producto._id,
                ...rest,
            });
        } else if (tipoProducto === 'Lentes de sol') {
            productoEspecifico = new LentesSol({
                productoId: producto._id,
                ...rest,
            });
        }

        if (productoEspecifico) {
            await productoEspecifico.save({session});
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ producto, productoEspecifico });

    }catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('tipoProducto').populate('marca'); // Poblar tipoProducto y marca
        const productosConAtributosEspecificos = await Promise.all(productos.map(async (producto) => {
            let atributosEspecificos = {};
            if (producto.tipoProducto === 'Montura') {
                atributosEspecificos = await Montura.findOne({ productoId: producto._id });
            } else if (producto.tipoProducto === 'Lentes de sol') {
                atributosEspecificos = await LentesSol.findOne({ productoId: producto._id });
            }
            return { ...producto.toObject(), ...atributosEspecificos };
        }));
        res.json(productosConAtributosEspecificos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

export const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).populate('tipoProducto').populate('marca'); // Poblar tipoProducto y marca

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Obtener atributos específicos según el tipo de producto
        let atributosEspecificos = {};
        if (producto.tipoProducto === 'Montura') {
            atributosEspecificos = await Montura.findOne({ productoId: producto._id });
        } else if (producto.tipoProducto === 'Lentes de sol') {
            atributosEspecificos = await LentesSol.findOne({ productoId: producto._id });
        }

        // Combinar los atributos comunes y específicos
        const productoCompleto = { ...producto.toObject(), ...atributosEspecificos };

        res.json(productoCompleto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

export const actualizarProducto = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { tipoProducto, marca, ...restoActualizaciones } = req.body;

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Buscar el ObjectId de la marca proporcionada
        const marcaEncontrada = await Marca.findOne({ nombre: marca });
        if (!marcaEncontrada) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        // Actualizar los atributos comunes del producto
        Object.keys(restoActualizaciones).forEach(key => {
            producto[key] = restoActualizaciones[key];
        });
        // Asignar el ObjectId de la marca al campo "marca" del producto
        producto.marca = marcaEncontrada._id;
        await producto.save({ session });

        let productoEspecifico;

        // Actualizar los atributos específicos según el tipo de producto
        if (tipoProducto === 'Montura') {
            productoEspecifico = await Montura.findOneAndUpdate({ productoId: id }, restoActualizaciones, { new: true, session });
        } else if (tipoProducto === 'Lentes de sol') {
            productoEspecifico = await LentesSol.findOneAndUpdate({ productoId: id }, restoActualizaciones, { new: true, session });
        }

        await session.commitTransaction();
        session.endSession();

        res.json({ producto, productoEspecifico });
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).send('Hubo un error');
    }
};