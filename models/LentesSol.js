import mongoose from "mongoose";
const { Schema } = mongoose;

const LentesSolSchema = mongoose.Schema({

    productoId: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
    },
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

export default mongoose.model("LenteSol", LentesSolSchema);
//module.exports = mongoose.model('LentesSol', LentesSolSchema);
//export default Producto.discriminator('LentesSol', LentesSolSchema);;