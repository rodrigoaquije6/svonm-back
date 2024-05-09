const mongoose = require('mongoose');

const LentesSolSchema = mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    género: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    forma: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    colorLente: {
        type: String,
        required: true
    },
    proteccionUV: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('LentesSol', LentesSolSchema);