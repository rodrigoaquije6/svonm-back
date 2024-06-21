import { Router } from "express";
import {
    crearDevolucion,
    obtenerDevoluciones,
    obtenerDevolucion,
    actualizarDevolucion
} from "../controllers/devolucionController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/devolucion', authRequired, crearDevolucion);
router.get('/devolucion', authRequired, obtenerDevoluciones);
router.put('/devolucion/:id', authRequired, actualizarDevolucion);
router.get('/devolucion/:id', authRequired, obtenerDevolucion);

export default router;