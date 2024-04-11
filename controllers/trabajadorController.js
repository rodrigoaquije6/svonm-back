const Trabajador = require("../models/Trabajador");

exports.crearTrabajador = async (req, res) => {
    try {
        let trabajador;

        trabajador = new Trabajador(req.body);

        await trabajador.save();
        res.send(trabajador);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
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