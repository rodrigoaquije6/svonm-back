import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      trim: true,
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
    estado: {
      type: String,
      default: 'Activo',// Atributo estado con valor por defecto 'Activo'
      enum: ['Activo', 'Inactivo']// Opcional: restringe los valores posibles
    },
    fechaCreacion: {
      type: Date,
      default: Date.now(),
    },
  });

export default mongoose.model("Producto", ProductoSchema);