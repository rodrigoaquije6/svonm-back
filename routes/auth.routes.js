import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validatorMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
//probablemente se necesite un nuevo controller para estos metodos
router.get("/getusers", authRequired, getUsers);
router.get("/getuser/:id", authRequired, getUser);
router.put("/putuser/:id", authRequired, updateUser);
router.delete("/deluser/:id", authRequired, deleteUser);


export default router;