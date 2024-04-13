import mongoose from "mongoose";

const RolSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Rol', RolSchema);
export default mongoose.model("Rol", RolSchema);