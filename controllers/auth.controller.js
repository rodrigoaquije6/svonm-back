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
  const userId = req.params.id; // ID del usuario que se desea obtener

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Filtrar los datos sensibles como la contraseña antes de enviar la respuesta
    const { password, ...userData } = user.toObject();

    if (userData.fecha_nac instanceof Date) {
      userData.fecha_nac = userData.fecha_nac.toISOString().slice(0, 10);
    }

    res.json(userData); // Enviar datos del usuario al cliente
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { dni, nombres, apellidos, celular, fecha_nac, role, email, nuevaContrasena } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.dni = dni;
    user.nombres = nombres;
    user.apellidos = apellidos;
    user.celular = celular;
    user.fecha_nac = fecha_nac;
    user.role = role;
    user.email = email;

    // Si se proporciona una nueva contraseña, encriptarla y actualizarla
    if (nuevaContrasena) {
      const passwordHash = await bcrypt.hash(nuevaContrasena, 10);
      user.password = passwordHash;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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