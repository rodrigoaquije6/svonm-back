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
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

//module.exports = mongoose.model('Luna', LunaSchema);
export default mongoose.model("Luna", LunaSchema);