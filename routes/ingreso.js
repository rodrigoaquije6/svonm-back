import { Router } from "express";
import {
    crearIngreso,
    obtenerIngresos,
    obtenerIngreso,
    actualizarIngreso,
    actualizarEstadoIngreso
} from "../controllers/ingresoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/ingreso', authRequired, crearIngreso);
router.get('/ingreso', authRequired, obtenerIngresos);
router.put('/ingreso/:id', authRequired, actualizarIngreso);
router.put('/ingreso/:id/estado', actualizarEstadoIngreso);
router.get('/ingreso/:id', authRequired, obtenerIngreso);

export default router;