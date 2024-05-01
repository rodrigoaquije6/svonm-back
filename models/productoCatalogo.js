import mongoose from "mongoose";

const ProductoCatalogoSchema = mongoose.Schema({

nombre:{
    type: String,
    required: true
},
precio: {
    type: String,
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
material: {
    type: String,
    required: true
},
imagen: {
    type: String,
}
});

export default mongoose.model("Catalogo", ProductoCatalogoSchema);