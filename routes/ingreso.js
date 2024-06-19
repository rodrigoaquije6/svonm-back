import { Router } from "express";
import {
    crearIngreso,
    obtenerIngresos,
    obtenerIngreso,
    actualizarIngreso
} from "../controllers/ingresoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/ingreso', authRequired, crearIngreso);
router.get('/ingreso', authRequired, obtenerIngresos);
router.put('/ingreso/:id', authRequired, actualizarIngreso);
router.get('/ingreso/:id', authRequired, obtenerIngreso);

export default router;