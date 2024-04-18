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
      pnombre: {
        type: String,
        required: true,
      },
      snombre: {
        type: String,
      },
      apellidop: {
        type: String,
        required: true,
      },
      apellidom: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        trim: true,
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
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export default mongoose.model("User", userSchema);