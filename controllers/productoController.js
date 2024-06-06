import Producto from "../models/producto.model.js";
import Montura from "../models/Montura.js";
import LentesSol from "../models/LentesSol.js";
import TipoProducto from "../models/TipoProducto.js";
import Marca from "../models/Crear-marca.js";
import Almacen from "../models/almacen.js";
import Catalogo from "../models/catalogo.js";

export const crearProducto = async (req, res) => {

    try {
        const { codigo, tipoProducto, nombre, precio, imagen, marca, estado, ...rest } = req.body;

        // Obtener el documento del tipo de producto
        const tipoProductoDoc = await TipoProducto.findOne({ nombre: tipoProducto });
        if (!tipoProductoDoc) {
            throw new Error('Tipo de producto no encontrado');
        }

        // Obtener el documento de la marca
        const marcaDoc = await Marca.findOne({ nombre: marca });
        if (!marcaDoc) {
            throw new Error('Marca no encontrada');
        }

        // Crear el producto base
        const producto = new Producto({
            codigo,
            tipoProducto: tipoProductoDoc._id,
            nombre,
            precio,
            imagen,
            marca: marcaDoc._id,
            estado
        });

        await producto.save();

        // Obtener el ID del producto creado
        const productoId = producto._id;

        // Crear el documento en Almacen con el ID del producto y stock inicial de 0
        const almacen = new Almacen({
            producto: productoId,
            stock: 0
        });

        await almacen.save();

        // Crear el documento en Catalogo con el ID del producto y estado 'Activo'
        const catalogo = new Catalogo({
            producto: productoId,
            estado: 'Activo'
        });

        await catalogo.save();

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
            await productoEspecifico.save();
        }

        res.status(201).json({ producto, productoEspecifico, catalogo, almacen });

    } catch (error) {
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

        let productoCompleto;

        if (producto.tipoProducto.nombre === 'Montura') {
            const montura = await Montura.findOne({ productoId: producto._id });
            if (!montura) {
                return res.status(404).json({ msg: 'Montura no encontrada' });
            }
            productoCompleto = { ...producto.toObject(), ...montura.toObject() };
        } else if (producto.tipoProducto.nombre === 'Lentes de sol') {
            const lentesSol = await LentesSol.findOne({ productoId: producto._id });
            if (!lentesSol) {
                return res.status(404).json({ msg: 'Lentes de sol no encontrados' });
            }
            productoCompleto = { ...producto.toObject(), ...lentesSol.toObject() };
        } else {
            productoCompleto = { ...producto.toObject() };
        }

        res.json(productoCompleto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoProducto, marca, ...restoActualizaciones } = req.body;

        //console.log("ID del producto:", id);
        //console.log('Datos recibidos:', req.body);

        const producto = await Producto.findById(id).populate('tipoProducto').populate('marca');;
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        //console.log('Producto encontrado:', producto);


        // Buscar el ObjectId de la marca proporcionada
        const marcaEncontrada = await Marca.findOne({ nombre: marca });
        if (!marcaEncontrada) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        //console.log('Marca encontrada:', marcaEncontrada);


        // Actualizar los campos comunes
        Object.assign(producto, restoActualizaciones);
        // Asignar el ObjectId de la marca al campo "marca" del producto
        producto.marca = marcaEncontrada._id;
        // Guardar los cambios en el producto
        await producto.save();

        //console.log('Producto actualizado:', producto);


        let productoEspecifico;
        let especificoActualizado;


        // Actualizar los atributos específicos según el tipo de producto
        if (producto.tipoProducto.nombre === 'Montura') {
            productoEspecifico = await Montura.findOne({ productoId: id });
            if (productoEspecifico) {
                console.log('Montura encontrada:', productoEspecifico);
                Object.assign(productoEspecifico, restoActualizaciones);
                especificoActualizado = await productoEspecifico.save();
                //console.log('Montura actualizada:', especificoActualizado);
            } else {
                //console.log('Montura no encontrada para este producto.');
            }
        } else if (producto.tipoProducto.nombre === 'Lentes de sol') {
            productoEspecifico = await LentesSol.findOne({ productoId: id });
            if (productoEspecifico) {
                console.log('Lentes de sol encontrados:', productoEspecifico);
                Object.assign(productoEspecifico, restoActualizaciones);
                especificoActualizado = await productoEspecifico.save()
                //console.log('Lentes de sol actualizados:', especificoActualizado);
            } else {
                //console.log('Lentes de sol no encontrados para este producto.');
            }
        }

        // Crear el producto completo combinando el producto común y los datos específicos
        const productoCompleto = {
            ...producto.toObject(),
            ...(especificoActualizado ? especificoActualizado.toObject() : {})
        };

        //console.log('Producto completo:', productoCompleto);

        res.json(productoCompleto);
    } catch (error) {
        console.error('Hubo un error al actualizar el producto:', error);
        res.status(500).send('Hubo un error al actualizar el producto');
    }
};