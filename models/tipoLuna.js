import mongoose from "mongoose";

const TipoLunaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        default: 'Activo',// Atributo estado con valor por defecto 'Activo'
        enum: ['Activo', 'Inactivo']// Opcional: restringe los valores posibles
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("TipoLuna", TipoLunaSchema);