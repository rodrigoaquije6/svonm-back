import mongoose from "mongoose";

const ClienteSchema = mongoose.Schema({
    dni: {
        type: Number,
        required: true,
        unique: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    celular: {
        type: Number,
        required: true,
    },
    direccion: {
        type: String,
        required: true
    },
    correo: {
        type: String,
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

export default mongoose.model("Cliente", ClienteSchema);