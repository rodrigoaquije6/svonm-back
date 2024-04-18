import mongoose from "mongoose";

const CrearMarcaSchema = mongoose.Schema({

nombre:{
    type:String,
    required:true
},
fechaCreacion: {
    type: Date,
    default: Date.now()
}
});

//module.exports = mongoose.model('Marca',CrearMarcaSchema);
export default mongoose.model("Marca", CrearMarcaSchema);