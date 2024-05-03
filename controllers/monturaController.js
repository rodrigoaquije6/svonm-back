import Montura from "../models/Montura.js";

export const crearMontura = async (req, res) => {
    try {
        // Extraer los datos de la montura del cuerpo de la solicitud
        const { codigo, tipoP, nombre, precio, imagen, marca, color, género, forma  } = req.body;

        // Crear una nueva instancia de Montura con los datos proporcionados
        const nuevaMontura = new Montura({
            codigo,
            tipoP,
            nombre,
            precio,
            imagen,
            marca,
            color,
            género,
            forma
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

export const actualizarMontura = async (req, res) => {
    try {

        const { codigo, tipoP, nombre, precio, imagen, marca, color, género, forma  } = req.body;
        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        montura.codigo = codigo,
        montura.tipoP = tipoP,
        montura.nombre = nombre,
        montura.precio = precio,
        montura.imagen = imagen,
        montura.marca = marca,
        montura.color = color,
        montura.género = género,
        montura.forma = forma
        

        montura = await Montura.findOneAndUpdate({ _id: req.params.id }, montura, { new: true })
        res.json(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerMonturas = async (req, res) => {
    try {

        const monturas = await Montura.find();
        res.json(monturas)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerMontura = async (req, res) => {
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

export const eliminarMontura = async (req, res) => {
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