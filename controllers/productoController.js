import Producto from "../models/producto.model.js";
import Montura from "../models/Montura.js";
import LentesSol from "../models/LentesSol.js";
import TipoProducto from "../models/TipoProducto.js";
import Proveedor from "../models/proveedor.js"
import Marca from "../models/Crear-marca.js";

export const crearProducto = async (req, res) => {

    try {
        const { codigo, tipoProducto, nombre, precio, imagen, marca, proveedor, stock, stockMinimo, estado, ...rest } = req.body;

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

        // Obtener el documento del proveedor
        const proveedorDoc = await Proveedor.findOne({ nombre: proveedor });
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        // Crear el producto base
        const producto = new Producto({
            codigo,
            tipoProducto: tipoProductoDoc._id,
            nombre,
            precio,
            imagen,
            marca: marcaDoc._id,
            proveedor: proveedorDoc._id,
            stock,
            stockMinimo,
            estado
        });

        await producto.save();

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

        res.status(201).json({ producto, productoEspecifico});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('tipoProducto').populate('marca').populate('proveedor'); //Poblar tipoProducto, marca y proveedor
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
        const producto = await Producto.findById(req.params.id).populate('tipoProducto').populate('marca').populate('proveedor'); //Poblar tipoProducto, marca y proveedor

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
        const { tipoProducto, marca, proveedor, ...restoActualizaciones } = req.body;
        const producto = await Producto.findById(id).populate('tipoProducto').populate('marca').populate('proveedor');
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Buscar el ObjectId de la marca proporcionada
        const marcaEncontrada = await Marca.findOne({ nombre: marca });
        if (!marcaEncontrada) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        // Buscar el ObjectId de la marca proporcionada
        const proveedorEncontrado = await Proveedor.findOne({ nombre: proveedor });
        if (!proveedor) {
            return res.status(404).json({ msg: 'Proveedor no encontrado' });
        }

        // Actualizar los campos comunes
        Object.assign(producto, restoActualizaciones);
        // Asignar el ObjectId de la marca al campo "marca" y el ObjectId del proveedor en el campo "proveedor" del producto 
        producto.proveedor = proveedorEncontrado._id;
        producto.marca = marcaEncontrada._id;
        // Guardar los cambios en el producto
        await producto.save();

        let productoEspecifico;
        let especificoActualizado;


        // Actualizar los atributos específicos según el tipo de producto
        if (producto.tipoProducto.nombre === 'Montura') {
            productoEspecifico = await Montura.findOne({ productoId: id });
            if (productoEspecifico) {
                console.log('Montura encontrada:', productoEspecifico);
                Object.assign(productoEspecifico, restoActualizaciones);
                especificoActualizado = await productoEspecifico.save();
            } else {
            }
        } else if (producto.tipoProducto.nombre === 'Lentes de sol') {
            productoEspecifico = await LentesSol.findOne({ productoId: id });
            if (productoEspecifico) {
                console.log('Lentes de sol encontrados:', productoEspecifico);
                Object.assign(productoEspecifico, restoActualizaciones);
                especificoActualizado = await productoEspecifico.save()
            } else {
            }
        }

        // Crear el producto completo combinando el producto común y los datos específicos
        const productoCompleto = {
            ...producto.toObject(),
            ...(especificoActualizado ? especificoActualizado.toObject() : {})
        };

        res.json(productoCompleto);
    } catch (error) {
        console.error('Hubo un error al actualizar el producto:', error);
        res.status(500).send('Hubo un error al actualizar el producto');
    }
};

export const obtenerProductosPorProveedor = async (req, res) => {
    try {
        const { idProveedor } = req.params;
        const productos = await Producto.find({ proveedor: idProveedor, estado: 'Activo' }).populate('proveedor');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos por proveedor:', error);
        res.status(500).send('Hubo un error');
    }
};