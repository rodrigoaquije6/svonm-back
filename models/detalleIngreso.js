import mongoose from "mongoose";

const DetalleIngresoSchema = mongoose.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    idIngreso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingreso',
        required: true
    },
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("DetalleIngreso", DetalleIngresoSchema);