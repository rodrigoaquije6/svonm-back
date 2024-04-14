const Producto = require('../models/Producto');
const Montura = require('../models/Montura');
const LentesDeSol = require('../models/LentesSol');

// Controlador para crear un producto
exports.crearProducto = async (req, res) => {
    try {
        const { código, tipoP, nombre, precio, imagen } = req.body;

        let producto;
        let entidadSecundaria;

        // Creamos el producto
        producto = new Producto(req.body);
        await producto.save();

        // Si el producto es una montura
        if (tipoP === 'Monturas') {
            entidadSecundaria = new Montura({ producto: producto._id, marca, color, género, forma, material, fechaCreacion });
            await entidadSecundaria.save();
        }
        // Si el producto es unos lentes de sol
        else if (tipoP === 'Lentes de sol') {
            entidadSecundaria = new LentesDeSol({ producto: producto._id, marca, género, material, forma, color, colorLentes, proteccionUV, fechaCreacion });
            await entidadSecundaria.save();
        }

        res.send(producto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};