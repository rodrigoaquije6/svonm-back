import { Router } from "express";
import {
    crearProductoCatalogo,
    obtenerProductoCatalogo,
    obtenerProductosCatalogo,
    actualizarProductoCatalogo,
    eliminarProductoCatalogo
} from "../controllers/productocatalogoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/productoCatalogo', authRequired, crearProductoCatalogo);
router.get('/productoCatalogo', authRequired, obtenerProductosCatalogo);
router.put('/productoCatalogo/:id', authRequired, actualizarProductoCatalogo);
router.delete('/productoCatalogo/:id', authRequired, eliminarProductoCatalogo);
router.get('/productoCatalogo/:id', authRequired, obtenerProductoCatalogo);

export default router;
