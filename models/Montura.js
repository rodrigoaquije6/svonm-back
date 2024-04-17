const mongoose = require('mongoose');

const MonturaSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },

    nombre: {
        type: String,
        required: true
    },

    color: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },
    imagen: { 
        type: String 
    },

    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Montura', MonturaSchema);