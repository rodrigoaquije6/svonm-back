import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const {
    user_dni,
    role,
    nombres,
    apellidos,
    celular,
    password,
    fecha_nac,
    email,
    estado
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_dni,
      role,
      nombres,
      apellidos,
      celular,
      password: passwordHash,
      fecha_nac,
      email,
      estado,
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
      email: userSaved.email,
      fechaCreacion: userSaved.fechaCreacion,
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
      return res.status(400).json({ message: "Contraseña Incorecta" });

    // Verificar si el usuario está activo
    if (userFound.estado !== 'Activo') {
      return res.status(403).json({ message: "Usuario inactivo. No puede acceder al sistema." });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      token,
      id: userFound._id,
      estado: userFound.estado,
      role: userFound.role,
      email: userFound.email,
      fechaCreacion: userFound.fechaCreacion,
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
    _id: userFound._id,
    nombres: userFound.nombres,
    apellidos: userFound.apellidos,
    email: userFound.email,
    fechaCreacion: userFound.fechaCreacion,
  });
};

//metodos RUD (sin create) para usuarios, probablemente se necesite un nuevo controller para ellos
export const getUsers = async (req, res) => {
  // const page = req.query.page;
  // const limit = req.query.limit;

  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;

  const users = await User.find({ _id: { $ne: "651a425a3f2658512f3fad59" } });
  //const resultUsers = users.slice(startIndex, endIndex);
  res.json(users);
};

export const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener la contraseña desencriptada desde el cuerpo de la solicitud
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Se requiere la contraseña para acceder al perfil' });
    }

    // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Devolver los datos del usuario sin la contraseña
    const { password: userPassword, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json(user);
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función para actualizar el estado de un trabajador
export const actualizarEstadoTrabajador = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const trabajador = await User.findById(id);
    if (!trabajador) {
      return res.status(404).json({ msg: 'Trabajador no encontrado' });
    }

    trabajador.estado = estado;
    await trabajador.save();

    res.json({ msg: 'Estado del trabajador actualizado correctamente', trabajador });
  } catch (error) {
    console.error('Hubo un error al actualizar el estado del trabajador:', error);
    res.status(500).send('Hubo un error al actualizar el estado del trabajador');
  }
};