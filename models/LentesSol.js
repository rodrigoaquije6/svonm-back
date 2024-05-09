import mongoose from "mongoose";
import Producto from "./producto.model.js";

const LentesSolSchema = mongoose.Schema({
    genero: {
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
    colorlente: {
        type: String,
        required: true
    },
    protuv: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('LentesSol', LentesSolSchema);
export default Producto.discriminator('LentesSol', LentesSolSchema);;