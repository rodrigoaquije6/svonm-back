const Montura = require("../models/Montura");

exports.crearMontura = async (req, res) => {
    try {
        // Extraer los datos de la montura del cuerpo de la solicitud
        const { codigo, marca, nombre, color, género, precio, forma, imagen } = req.body;

        // Crear una nueva instancia de Montura con los datos proporcionados
        const nuevaMontura = new Montura({
            codigo,
            marca,
            nombre,
            color,
            género,
            precio,
            forma,
            imagen
        });

        // Guardar la montura en la base de datos
        await nuevaMontura.save();

        // Devolver la montura guardada como respuesta
        res.status(201).json(nuevaMontura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarMontura = async (req, res) => {
    try {

        const { codigo, marca, nombre, color, género, precio, forma, imagen } = req.body;
        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        montura.codigo = codigo,
        montura.marca = marca,
        montura.nombre = nombre,
        montura.color = color,
        montura.género = género,
        montura.precio = precio,
        montura.forma = forma,
        montura.imagen = imagen,

        montura = await Montura.findOneAndUpdate({ _id: req.params.id }, montura, { new: true })
        res.json(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerMonturas = async (req, res) => {
    try {

        const monturas = await Montura.find();
        res.json(monturas)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerMontura = async (req, res) => {
    try {

        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        res.json(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarMontura = async (req, res) => {
    try {

        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        await montura.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Montura eliminada con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}