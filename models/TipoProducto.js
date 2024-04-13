const mongoose = require('mongoose');

const TipoProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('TipoProducto', TipoProductoSchema);