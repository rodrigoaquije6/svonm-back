/*import LentesSol from "../models/LentesSol.js";
import LenteSol from "../models/LentesSol.js";

export const crearLenteSol = async (req, res) => {
    try {
        // Extraer los datos de la montura del cuerpo de la solicitud
        const { codigo, tipoProducto, nombre, precio, imagen, marca, color, genero, forma, colorlente, protuv } = req.body;

        // Crear una nueva instancia de Montura con los datos proporcionados
        const nuevoLenteSol = new LenteSol({
            codigo,
            tipoProducto,
            nombre,
            precio,
            imagen,
            marca,
            color,
            genero,
            forma,
            colorlente,
            protuv
        });

        // Guardar la montura en la base de datos
        await nuevoLenteSol.save();

        // Devolver la montura guardada como respuesta
        res.status(201).json(nuevoLenteSol);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarLenteSol = async (req, res) => {
    try {

        const { codigo, tipoProducto, nombre, precio, imagen, marca, color, genero, forma, colorlente, protuv  } = req.body;
        let lenteSol = await LenteSol.findById(req.params.id);

        if (!lenteSol) {
            res.status(404).json({ msg: 'No existe el lente de sol' })
        }

        lenteSol.codigo = codigo,
        lenteSol.tipoProducto = tipoProducto,
        lenteSol.nombre = nombre,
        lenteSol.precio = precio,
        lenteSol.imagen = imagen,
        lenteSol.marca = marca,
        lenteSol.color = color,
        lenteSol.genero = genero,
        lenteSol.forma = forma,
        lenteSol.colorlente = colorlente,
        LentesSol.protuv = protuv
        
        lenteSol = await LenteSol.findOneAndUpdate({ _id: req.params.id }, lenteSol, { new: true })
        res.json(lenteSol);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerLentesSol = async (req, res) => {
    try {

        const lentesSol = await LenteSol.find();
        res.json(lentesSol)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerLenteSol= async (req, res) => {
    try {

        let lenteSol = await LenteSol.findById(req.params.id);

        if (!lenteSol) {
            res.status(404).json({ msg: 'No existe el lente de sol' })
        }

        res.json(lenteSol);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarLenteSol = async (req, res) => {
    try {

        let lenteSol = await LenteSol.findById(req.params.id);

        if (!lenteSol) {
            res.status(404).json({ msg: 'No existe el lente de sol' })
        }

        await lenteSol.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Lente de sol eliminado con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/