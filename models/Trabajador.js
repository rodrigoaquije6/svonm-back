import mongoose from "mongoose";

const TrabajadorSchema = mongoose.Schema({
    dni: {
        type: String,
        required: true
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
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Trabajador', TrabajadorSchema);
export default mongoose.model("Trabajador", TrabajadorSchema);