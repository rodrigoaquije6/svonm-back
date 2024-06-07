import NombreLuna from "../models/Luna.js";

export const crearNombreLuna = async (req, res) => {
    try {
        let nombreluna;

        //Cramos nuestro Nombreluna
        nombreluna = new NombreLuna(req.body);

        await nombreluna.save();
        res.send(nombreluna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerNombreLunas = async (req, res) => {
    try {

        const nombrelunas = await NombreLuna.find();
        res.json(nombrelunas)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerNombreLuna = async (req, res) => {
    try {

        let nombreluna = await NombreLuna.findById(req.params.id);

        if (!nombreluna) {
            res.status(404).json({ msg: 'No existe el tipo luna' })
        }

        res.json(nombreluna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarNombreLuna = async (req, res) => {
    try {

        const { tipoluna, preciodeluna } = req.body;
        let nombreluna = await NombreLuna.findById(req.params.id);

        if (!nombreluna) {
            res.status(404).json({ msg: 'No existe el tipo luna' })
        }

        nombreluna.tipoluna = tipoluna,
        nombreluna.preciodeluna = preciodeluna,

        luna = await NombreLuna.findOneAndUpdate({ _id: req.params.id }, nombreluna, { new: true })
        res.json(nombreluna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarNombreLuna = async (req, res) => {
    try {

        let nombreluna = await NombreLuna.findById(req.params.id);

        if(!nombreluna){
            res.status(404).json({ msg: 'No existe el tipo nombre' })
        }

        await nombreluna.deleteOne({ _id: req.params.id })
        res.json({ msg: 'el tipo de luna fue eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}