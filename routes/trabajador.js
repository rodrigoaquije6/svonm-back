import { Router } from "express";
import {
  getUsers,
  register,
  getUser,
  updateUser
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTrabajador from "../validation/trabajadorValidator.js";

const router = Router();

//api/trabajador
router.post('/trabajador', authRequired, register); //validationTrabajador(),
router.get('/trabajador', authRequired, getUsers);
router.put('/trabajador/:id', authRequired, updateUser);
//router.delete('/trabajador/:id', authRequired, eliminarTrabajador);
router.get('/trabajador/:id', authRequired, getUser);

export default router;