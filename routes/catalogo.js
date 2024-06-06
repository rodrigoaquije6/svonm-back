import { Router } from "express";
import {
    crearCatalogo,
    obtenerCatalogo,
    obtenerProducto,
    eliminarCatalogo,
    actualizarCatalogo
} from "../controllers/catalogoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/catalogo', authRequired, crearCatalogo);
router.get('/catalogo', authRequired, obtenerCatalogo);
router.put('/catalogo/:id', authRequired, actualizarCatalogo);
router.get('/catalogo/:id', authRequired, obtenerProducto);
router.delete('/catalogo/:id', authRequired, eliminarCatalogo);

export default router;