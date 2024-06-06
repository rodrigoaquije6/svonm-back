import almacen from "../models/almacen.js"

export const crearAlmacen = async (req,res) =>{}

export const obtenerAlmacen = async (req, res) => {
    try {
        const productos = await almacen.find();
        res.json(productos)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProducto = async (req, res) => {
    try {

        let producto = await almacen.findById(req.params.id);

        if (!producto) {
            res.status(404).json({ msg: 'No existe el producto' })
        }

        res.json(producto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


export const actualizarAlmacen = async (req, res) => {
    try {

        const {stock} = req.body;
        let producto = await almacen.findById(req.params.id);

        if (!producto) {
            res.status(404).json({ msg: 'No existe el producto' })
        }

        producto.stock = stock,
        

        producto = await almacen.findOneAndUpdate({ _id: req.params.id }, producto, { new: true })
        res.json(producto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarAlmacen = async (req, res) =>{
    
}