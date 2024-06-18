import Catalogo from "../models/catalogo.js";

export const crearCatalogo = async (req, res) => {
    try {
        let catalogo;

        catalogo = new Catalogo(req.body);

        await catalogo.save();
        res.send(catalogo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerCatalogo = async (req, res) => {
    try {

        const catalogo = await Catalogo.find();
        res.json(catalogo)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProducto = async (req, res) => {
    try {

        let catalogo = await Catalogo.findById(req.params.id);

        if (!catalogo) {
            res.status(404).json({ msg: 'No existe el catalogo' })
        }

        res.json(catalogo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


export const actualizarCatalogo = async (req, res) => {
    try {

        const { producto, estado } = req.body;
        let catalogo = await Catalogo.findById(req.params.id);

        if (!catalogo) {
            res.status(404).json({ msg: 'No existe el producto' })
        }

        catalogo.estado = estado;

        catalogo = await Catalogo.findOneAndUpdate({ _id: req.params.id }, catalogo, { new: true })
        res.json(catalogo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


export const eliminarCatalogo = async (req, res) => {
    try {

        let catalogo = await Catalogo.findById(req.params.id);

        if (!catalogo) {
            res.status(404).json({ msg: 'No existe el catalogo' })
        }

        await catalogo.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Rol eliminado con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}