import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  emailValidated: { type: Boolean, default: false },
  password: { type: String, required: [true, "Password is required"] },
  img: { type: String },
  role: { type: [String], enum: ["ADMIN_ROLE", "USER_ROLE"], default: ["ADMIN_ROLE"] },
  // createdAt: { type: Date, default: Date.now },
})


// creamos el modelo basado en el esquema
export const UserModel = mongoose.model('User', userSchema)