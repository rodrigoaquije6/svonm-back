const Trabajador = require("../models/Trabajador")

exports.crearTrabajador = async (req, res) => {
    try {
        let trabajador;

        //Cramos nuestro trabajador
        trabajador = new Trabajador(req.body);

        await trabajador.save();
        res.send(trabajador);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerTrabajadores = async (req, res) => {
    try {

        const trabajadores = await Trabajador.find();
        res.json(trabajadores)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerTrabajador = async (req, res) => {
    try {

        let trabajador = await Trabajador.findById(req.params.id);

        if (!trabajador) {
            res.status(404).json({ msg: 'No existe el trabajador' })
        }

        res.json(trabajador);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTrabajador = async (req, res) => {
    try {

        const { dni, nombre, rol, estado } = req.body;
        let trabajador = await Trabajador.findById(req.params.id);

        if (!trabajador) {
            res.status(404).json({ msg: 'No existe el trabajador' })
        }

        trabajador.dni = dni,
        trabajador.nombre = nombre,
        trabajador.rol = rol,
        trabajador.estado = estado,

        trabajador = await Trabajador.findOneAndUpdate({ _id: req.params.id }, trabajador, { new: true })
        res.json(trabajador);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTrabajador = async (req, res) => {
    try {

        let trabajador = await Trabajador.findById(req.params.id);

        if (!trabajador) {
            res.status(404).json({ msg: 'No existe el producto' })
        }

        await trabajador.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Trabajador eliminado con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}