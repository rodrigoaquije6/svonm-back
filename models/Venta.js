import mongoose from "mongoose";
import { productoSchema } from "./producto.model.js";

const TratamientoSchema = new mongoose.Schema ({
    nombre: { 
        type: String 
    },
    precio: { 
        type: Number, 
        default: 0 
    },
});

const VentaSchema = mongoose.Schema({

    nombreCliente: {
        type: String,
        required: true
    },

    fechaVenta: {
        type: Date,
        required: true
    },

    celCliente: {
        type: String,
        required: true
    },

    dirCliente: {
        type: String,
        required: true
    },

    fijCliente: {
        type: String,
        required: true
    },

    corrCliente: {
        type: String,
        required: true
    },
///////////////
    odEsfera: {
        type: String,
    },
    odClindro: {
        type: String,
    },
    odEje: {
        type: String,
    },
    odAVLejos: {
        type: String,
    },
    odAVCerca: {
        type: String,
    },
//////////////
    oiEsfera: {
        type: String,
    },
    oiClindro: {
        type: String,
    },
    oiEje: {
        type: String,
    },
    oiAVLejos: {
        type: String,
    },
    oiAVCerca: {
        type: String,
    },

/////////////
    odAdd: {
        type: String,
    },
    odAltura: {
        type: String,
    },
    odCurva: {
        type: String,
    },
//////////////
    oiAdd: {
        type: String,
    },
    oiAltura: {
        type: String,
    },
    oiCurva: {
        type: String,
    },
///////////
    DipLejos: {
        type: String,
    },
    DipCerca: {
        type: String,
    },
///////////
observaciones: {
    type: String,
},
optometra: {
    type: String,
},
fechaEntrega: {
    type: Date,
},
vendedor: {
    type: String,
},
total: {
    type: Number,
    required: true
},
acuenta: {
    type: Number,
},
saldo: {
    type: Number,
},
//////////
tipoLuna: {
    type: String,
},
matLuna: {
    type: String,
},
//////////
    conSeguimiento: {
        type: Boolean,
        required: true
    },
    tratamientos: [TratamientoSchema],
    productos: [productoSchema]
});


//module.exports = mongoose.model('Montura', MonturaSchema);
export default mongoose.model("Venta", VentaSchema);