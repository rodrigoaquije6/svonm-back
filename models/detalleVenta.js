import mongoose from "mongoose";

const DetalleVentaSchema = mongoose.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    idVenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venta',
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

export default mongoose.model("DetalleVenta", DetalleVentaSchema);