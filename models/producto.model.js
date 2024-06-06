import mongoose from "mongoose";

export const productoSchema = new mongoose.Schema(
    {
      codigo: {
        type: String,
        required: true,
        trim: true,
      },
      tipoProducto: {
        type: String,
        required: true,
        trim: true,
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
        type: String,
        required: true
      },
      fechaCreacion: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      timestamps: true,
    }
  );
  
  //export default mongoose.model("Producto", productoSchema);
  


  export const ProductModel = mongoose.model("Producto", productoSchema) 