const mongoose = require('mongoose');

const MonturaSchema = mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    género: {
        type: String,
        required: true
    },
    forma: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Montura', MonturaSchema);