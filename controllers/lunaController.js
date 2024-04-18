import Luna from "../models/Luna.js";

export const crearLuna = async (req, res) => {
    try {
        let luna;

        //Cramos nuestro luna
        luna = new Luna(req.body);

        await luna.save();
        res.send(luna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerLunas = async (req, res) => {
    try {

        const lunas = await Luna.find();
        res.json(lunas)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerLuna = async (req, res) => {
    try {

        let luna = await Luna.findById(req.params.id);

        if (!luna) {
            res.status(404).json({ msg: 'No existe la luna' })
        }

        res.json(luna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarLuna = async (req, res) => {
    try {

        const { material, precio } = req.body;
        let luna = await Luna.findById(req.params.id);

        if (!luna) {
            res.status(404).json({ msg: 'No existe la luna' })
        }

        luna.material = material,
        luna.precio = precio,

        luna = await Luna.findOneAndUpdate({ _id: req.params.id }, luna, { new: true })
        res.json(luna);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarLuna = async (req, res) => {
    try {

        let luna = await Luna.findById(req.params.id);

        if(!luna){
            res.status(404).json({ msg: 'No existe el producto' })
        }

        await luna.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Luna eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}