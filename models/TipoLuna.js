import mongoose from "mongoose";

const NombreLunaSchema = mongoose.Schema({
    tipoluna: {
        type: String,
        required: true
    },
    preciodeluna: {
        type: Number,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Luna', LunaSchema);
export default mongoose.model("NombreLuna", NombreLunaSchema);