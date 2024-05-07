import Catalogo from "../models/Catalogo.js";


export const obtenerCatalogos = async (req, res) => {
    try {

        const catalogos = await Catalogo.find();
        res.json(catalogos)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerCatalogo = async (req, res) => {
    try {

        let catalogo = await Catalogo.findById(req.params.id);

        if (!catalogo) {
            res.status(404).json({ msg: 'No existe el catálogo' })
        }

        res.json(catalogo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

