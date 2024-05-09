import mongoose from "mongoose";
import Producto from "./producto.model.js";

const MonturaSchema = mongoose.Schema({

    color: {
        type: String,
        required: true
    },

    genero: {
        type: String,
        required: true
    },

    forma: {
        type: String,
        required: true
    },

});


//module.exports = mongoose.model('Montura', MonturaSchema);
export default Producto.discriminator('Montura', MonturaSchema);;