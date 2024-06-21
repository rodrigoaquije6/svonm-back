import mongoose from 'mongoose';

const DevolucionSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    motivo: {
        type: String,
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
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('Devolucion', DevolucionSchema);
