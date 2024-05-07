import mongoose from "mongoose";

const CatalogoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    marca: {
        type: String,
        required: true
    },

    codigo: {
        type: String,
        required: true
    },
    
    genero: {
        type: String,
        required: true
    },

    material:{
        type:String,
        required: true
    },

    imagen: { 
        type: String,
        required: true
    },

});

//module.exports = mongoose.model('Catalogo', CatalogoSchema);
export default mongoose.model("Catalogo", CatalogoSchema);