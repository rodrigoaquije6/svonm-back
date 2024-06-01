import { ProductModel } from "../models/producto.model.js";

/*export const crearMontura = async (req, res) => {
    try {
        // Extraer los datos de la montura del cuerpo de la solicitud
        const { codigo, tipoProducto, nombre, precio, imagen, marca, color, genero, forma  } = req.body;

        // Crear una nueva instancia de Montura con los datos proporcionados
        const nuevaMontura = new Montura({
            codigo,
            tipoProducto,
            nombre,
            precio,
            imagen,
            marca,
            color,
            genero,
            forma
        });

        // Guardar la montura en la base de datos
        await nuevaMontura.save();

        // Devolver la montura guardada como respuesta
        res.status(201).json(nuevaMontura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarMontura = async (req, res) => {
    try {

        const { codigo, tipoProducto, nombre, precio, imagen, marca, color, genero, forma  } = req.body;
        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        montura.codigo = codigo,
        montura.tipoProducto = tipoProducto,
        montura.nombre = nombre,
        montura.precio = precio,
        montura.imagen = imagen,
        montura.marca = marca,
        montura.color = color,
        montura.genero = genero,
        montura.forma = forma
        

        montura = await Montura.findOneAndUpdate({ _id: req.params.id }, montura, { new: true })
        res.json(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await ProductModel.find();
        res.json(productos)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProducto = async (req, res) => {
    try {

        let producto = await ProductModel.findById(req.params.id);

        if (!producto) {
            res.status(404).json({ msg: 'No existe el producto' })
        }

        res.json(producto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/*export const eliminarMontura = async (req, res) => {
    try {

        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        await montura.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Montura eliminada con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/