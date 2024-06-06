import mongoose from "mongoose";

const AlmacenSchema = mongoose.Schema({

    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        default: 0,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Almacen", AlmacenSchema);