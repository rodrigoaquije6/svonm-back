const mongoose = require('mongoose');
const trabajador = require('./Trabajador');

const TrabajadorSchema = mongoose.Schema({
    dni: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Trabajador', TrabajadorSchema);