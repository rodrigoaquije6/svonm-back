import Marca from "../models/Crear-marca.js";

export const crearMarca = async (req, res) => {
    try {
        let marca;

        //creamos marca

        marca = new Marca(req.body);

        await marca.save();
        res.send(marca);



    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerMarcas = async (req, res) => {
    try {

        const marcas = await Marca.find();
        res.json(marcas)


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerMarca = async (req, res) => {
    try {

        let marcas = await Marca.findById(req.params.id);

        if (!marcas) {
            res.status(404).json({ msg: 'No existe la marca' })
        }

        res.json(marcas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarMarca = async (req, res) => {
    try {

        const { nombre } = req.body;
        let marcas = await Marca.findById(req.params.id);

        if (!marcas) {
            res.status(404).json({ msg: 'No existe la marca' })
        }

        marcas.nombre = nombre;

        marcas = await Marca.findOneAndUpdate({ _id: req.params.id }, marcas, { new: true })
        res.json(marcas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarMarca = async (req, res) => {
    try {

        let marca = await Marca.findById(req.params.id);

        if (!marca) {
            res.status(404).json({ msg: 'No existe la marca' })
        }

        await Marca.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Marca eliminada con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}