const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    código: {
        type: String,
        required: true
    },
    tipoP: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: Buffer,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);