import mongoose from "mongoose";

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

    género: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    forma: {
        type: String,
        required: true
    },
    imagen: { 
        type: String,
        required: true
    },

    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Montura', MonturaSchema);
export default mongoose.model("Montura", MonturaSchema);