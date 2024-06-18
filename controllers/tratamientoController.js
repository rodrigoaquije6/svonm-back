import Tratamiento from "../models/tratamiento.js";

export const crearTratamiento = async (req, res) => {
    try {
        let tratamiento;

        //Creamos nuestro tratamiento
        tratamiento = new Tratamiento(req.body);

        await tratamiento.save();
        res.send(tratamiento);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTratamientos = async (req, res) => {
    try {

        const tratamiento = await Tratamiento.find();
        res.json(tratamiento)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerTratamiento = async (req, res) => {
    try {

        let tratamiento = await Tratamiento.findById(req.params.id);

        if (!tratamiento) {
            res.status(404).json({ msg: 'No existe el tratamiento' })
        }

        res.json(tratamiento);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarTratamiento = async (req, res) => {
    try {

        const { nombre, precio } = req.body;
        let tratamiento = await Tratamiento.findById(req.params.id);

        if (!tratamiento) {
            res.status(404).json({ msg: 'No existe el tratamiento' })
        }

        tratamiento.nombre = nombre,
        tratamiento.precio = precio,

        tratamiento = await Tratamiento.findOneAndUpdate({ _id: req.params.id }, tratamiento, { new: true })
        res.json(tratamiento);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarTratamiento = async (req, res) => {
    try {

        let tratamiento = await Tratamiento.findById(req.params.id);

        if(!tratamiento){
            res.status(404).json({ msg: 'No existe el tratamiento' })
        }

        await tratamiento.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Tratameinto eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}