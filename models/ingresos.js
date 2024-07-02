import mongoose from "mongoose";

const IngresoSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    observacion: {
        type: String,
    },
    descuento: {
        type: Number,
    },
    impuesto: {
        type: Number,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    fechaEntregaEstimada: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        default: 'Pendiente',
        enum: ['Pendiente', 'Recibido']
    },
    idProveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    },
    idTrabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Ingreso", IngresoSchema);