const mongoose = require('mongoose');

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

module.exports = mongoose.model('Crear-marca',CrearMarcaSchema);