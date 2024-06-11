import mongoose from "mongoose";

const CrearMarcaSchema = mongoose.Schema({

nombre:{
    type:String,
    required:true
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

//module.exports = mongoose.model('Marca',CrearMarcaSchema);
export default mongoose.model("Marca", CrearMarcaSchema);