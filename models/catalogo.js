import mongoose from "mongoose";
const { Schema } = mongoose;

const CatalogoSchema = mongoose.Schema({

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    },
    estado: {
        type: String,
        default: 'Activo',
        enum: ['Activo', 'Inactivo'],
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Catalogo", CatalogoSchema);