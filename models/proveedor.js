import mongoose from "mongoose";

const ProveedorSchema = mongoose.Schema({
    ruc: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    nombreContacto: {
        type: String,
        required: true
    },
    apellidoContacto: {
        type: String,
        required: true
    },
    telefono: {
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
        default: 'Activo',
        enum: ['Activo', 'Inactivo']
      },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Proveedor", ProveedorSchema);