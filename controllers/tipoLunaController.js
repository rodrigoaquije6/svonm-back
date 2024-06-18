import TipoLuna from "../models/tipoLuna.js";

export const crearTipoLuna = async (req, res) => {
    try {
        let tipoLuna;

        //Cramos nuestro luna
        tipoLuna = new TipoLuna(req.body);

        await tipoLuna.save();
        res.send(tipoLuna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTipoLunas = async (req, res) => {
    try {

        const tipoLunas = await TipoLuna.find();
        res.json(tipoLunas)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTipoLuna = async (req, res) => {
    try {

        let tipoLuna = await TipoLuna.findById(req.params.id);

        if (!tipoLuna) {
            res.status(404).json({ msg: 'No existe el tipo de luna' })
        }

        res.json(tipoLuna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarTipoLuna = async (req, res) => {
    try {

        const { nombre, precio } = req.body;
        let tipoLuna = await TipoLuna.findById(req.params.id);

        if (!tipoLuna) {
            res.status(404).json({ msg: 'No existe el tipo de luna' })
        }

        tipoLuna.nombre = nombre,
        tipoLuna.precio = precio,

        tipoLuna = await TipoLuna.findOneAndUpdate({ _id: req.params.id }, tipoLuna, { new: true })
        res.json(tipoLuna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarTipoLuna = async (req, res) => {
    try {

        let tipoLuna = await TipoLuna.findById(req.params.id);

        if(!tipoLuna){
            res.status(404).json({ msg: 'No existe el tipo de luna' })
        }

        await tipoLuna.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Tipo de Luna eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}