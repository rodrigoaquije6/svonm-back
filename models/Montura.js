import mongoose from "mongoose";
const { Schema } = mongoose;

const MonturaSchema = mongoose.Schema({

    productoId: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
    },
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
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Montura", MonturaSchema);
//module.exports = mongoose.model('Montura', MonturaSchema);
//export default Producto.discriminator('Montura', MonturaSchema);;