import mongoose from "mongoose";

const TrabajadorSchema = mongoose.Schema({
    dni: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: 'Activo',
        enum: ['Activo', 'Inactivo']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Trabajador', TrabajadorSchema);
export default mongoose.model("Trabajador", TrabajadorSchema);