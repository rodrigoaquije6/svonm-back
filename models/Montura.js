import mongoose from "mongoose";
import { ProductModel } from "./producto.model.js";

const MonturaSchema = ProductModel.discriminator("Montura", new mongoose.Schema({

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

}));


//module.exports = mongoose.model('Montura', MonturaSchema);
export default MonturaSchema;