import mongoose from 'mongoose';

const DetalleDevolucionSchema = new mongoose.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    idDevolucion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Devolucion',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('DetalleDevolucion', DetalleDevolucionSchema);