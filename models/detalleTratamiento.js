import mongoose from "mongoose";

const DetalleTratamientoSchema = mongoose.Schema({

    idTratamiento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tratamiento',
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

export default mongoose.model("DetalleTratamiento", DetalleTratamientoSchema);