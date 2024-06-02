import mongoose from "mongoose";

const CatalogoSchema = mongoose.Schema({

    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
        unique: true,
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