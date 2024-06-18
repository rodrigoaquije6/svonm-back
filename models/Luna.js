import mongoose from "mongoose";

const LunaSchema = mongoose.Schema({
    material: {
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

//module.exports = mongoose.model('Luna', LunaSchema);
export default mongoose.model("Luna", LunaSchema);