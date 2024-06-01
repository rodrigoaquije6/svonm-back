import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema(
    {
      codigo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      tipoProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoProducto',
        required: true
      },
      nombre: {
        type: String,
        required: true,
      },
      precio: {
        type: Number,
        required: true,
      },
      imagen: {
        type: String,
      },
      marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marca',
        required: true
      },
      fechaCreacion: {
        type: Date,
        default: Date.now(),
      },
  });
  
  export default mongoose.model("Producto", ProductoSchema);