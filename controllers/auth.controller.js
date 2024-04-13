import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const {
    user_dni,
    role,
    pnombre,
    snombre,
    apellidop,
    apellidom,
    username,
    celular,
    password,
    fecha_nac,
    email,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_dni,
      role,
      pnombre,
      snombre,
      apellidop,
      apellidom,
      username,
      celular,
      password: passwordHash,
      fecha_nac,
      email,
      isActive: true,
    });

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({ message: "Usuario duplicado" });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      user_dni: userSaved.user_dni,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Password incorrecto" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      token,
      id: userFound._id,
      isActive: userFound.isActive,
      role: userFound.role,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) res.status(400).json({ message: "Usuario no encontrado" });

  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};
//metodos RUD (sin create) para usuarios, probablemente se necesite un nuevo controller para ellos
export const getUsers = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const users = await User.find({ _id: { $ne: "651a425a3f2658512f3fad59" } });
  const resultUsers = users.slice(startIndex, endIndex);
  res.json(resultUsers);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate('_id'); //podria incluir tambien todos los datos de usuario con el .populate

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json({
    _id: user._id,
    user_dni: user.user_dni,
    role: user.role,
    pnombre: user.pnombre,
    snombre: user.snombre,
    apellidop: user.apellidop,
    apellidom: user.apellidom,
    username: user.username,
    celular: user.celular,
    fecha_nac: user.fecha_nac,
    email: user.email,
    isActive: user.isActive,
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json(user);
};