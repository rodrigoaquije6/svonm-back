import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_dni: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    nombres: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    celular: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fecha_nac: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    fechaCreacion: {
      type: Date,
      default: Date.now()
    }
  });

export default mongoose.model("User", userSchema);