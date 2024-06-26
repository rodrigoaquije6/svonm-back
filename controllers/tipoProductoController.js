import TipoProducto from "../models/TipoProducto.js";

export const crearTipoProducto = async (req, res) => {
    try {
        let tipoProducto;

        //Cramos nuestro tipoProducto
        tipoProducto = new TipoProducto(req.body);

        await tipoProducto.save();
        res.send(tipoProducto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTiposProducto = async (req, res) => {
    try {

        const tipoProducto = await TipoProducto.find();
        res.json(tipoProducto)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarTipoProducto = async (req, res) => {
    try {

        const { nombre } = req.body;
        let tipoProducto = await TipoProducto.findById(req.params.id);

        if(!tipoProducto){
            res.status(404).json({ msg: 'No existe el tipo de producto' })
        }

        tipoProducto.nombre = nombre;

        tipoProducto = await TipoProducto.findOneAndUpdate({ _id: req.params.id }, tipoProducto, { new: true })
        res.json(tipoProducto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTipoProducto = async (req, res) => {
    try {

        let tipoProducto = await TipoProducto.findById(req.params.id);

        if(!tipoProducto){
            res.status(404).json({ msg: 'No existe el tipo de producto' })
        }

        res.json(tipoProducto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarTipoProducto = async (req, res) => {
    try {

        let tipoProducto = await TipoProducto.findById(req.params.id);

        if(!tipoProducto){
            res.status(404).json({ msg: 'No existe el tipo de producto' })
        }

        await tipoProducto.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Tipo de producto eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}