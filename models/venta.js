import mongoose from "mongoose";

const VentaSchema = mongoose.Schema({

    codigo: {
        type: String,
        required: true
    },
    oDEsfera: {
        type: String,
    },
    oDCilindro: {
        type: String,
    },
    oDEje: {
        type: Number,
    },
    oDAvLejos: {
        type: String,
    },
    oDAvCerca: {
        type: String,
    },
    oDAdd: {
        type: String,
    },
    oDAltura: {
        type: Number,
    },
    oDCurva: {
        type: Number,
    },
    oIEsfera: {
        type: String,
    },
    oICilindro: {
        type: String,
    },
    oIEje: {
        type: Number,
    },
    oIAvLejos: {
        type: String,
    },
    oIAvCerca: {
        type: String,
    },
    oIAdd: {
        type: String,
    },
    oIAltura: {
        type: Number,
    },
    oICurva: {
        type: Number,
    },
    dipLejos: {
        type: String,
    },
    dipCerca: {
        type: String,
    },
    observacion: {
        type: String,
        required: true
    },
    aCuenta: {
        type: Number,
        required: true,
    },
    saldo: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    estado: {
        type: String,
        enum: ['En Fabricación', 'En Tienda', 'Finalizada', 'Cambio Solicitado', 'Reembolsada']
    },
    idCliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    idTrabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idTipoLuna: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoLuna',
    },
    idMaterialLuna: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Luna',
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Venta", VentaSchema);