import mongoose from "mongoose";

const RolSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
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

//module.exports = mongoose.model('Rol', RolSchema);
export default mongoose.model("Rol", RolSchema);