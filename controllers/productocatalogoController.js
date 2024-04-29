import productoCatalogo from "../models/productoCatalogo.js";

export const crearProductoCatalogo = async(req, res) => {
    try {
        const { nombre, precio, marca, codigo, genero, material, imagen } = req.body;
        const nuevoProd = new productoCatalogo({
            nombre,
            precio,
            marca,
            codigo,
            genero,
            material,
            imagen
        });
        await nuevoProd.save();
        res.status(201).json(nuevoProd);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProductoCatalogo = async(req, res) => {
    try{
        let producto = await productoCatalogo.findById(req.params.id);
        if (!producto) {
            res.status(404).json({ msg: 'No existe el producto' })
        }
        res.json(producto);
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProductosCatalogo = async(req, res) => {
    try{
        const productos = await productoCatalogo.find();
        res.json(productos)
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarProductoCatalogo = async(req, res) => {
    try{
        const { nombre, precio, marca, codigo, genero, material, imagen } = req.body;
        let prod = await productoCatalogo.findById(req.params.id);
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarProductoCatalogo = async(req, res) => {
    try{
        let prod = await productoCatalogo.findById(req.params.id);
        if (!prod) {
            res.status(404).json({ msg: 'No existe el producto' })
        }
        await prod.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Producto eliminado exitosamente' });
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}