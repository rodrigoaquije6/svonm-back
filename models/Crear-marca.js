const mongoose = require('mongoose');

const CrearMarcaSchema = mongoose.Schema({
codigo:{
    type:Number,
    required:true
},
marca:{
    type:String,
    required:true
},
fechaCreacion: {
    type: Date,
    default: Date.now()
}
});

module.exports = mongoose.model('Crear-marca',CrearMarcaSchema);