import { Router } from "express";
import {
    crearAlmacen,
    obtenerAlmacen,
    obtenerProducto,
    actualizarAlmacen,
    eliminarAlmacen
} from "../controllers/almacenController.js"
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

router.post('/almacen', authRequired, crearAlmacen);
router.get('/almacen', authRequired, obtenerAlmacen);
router.put('/almacen/:id', authRequired, actualizarAlmacen);
router.get('/almacen/:id', authRequired, obtenerProducto);
router.delete('/almacen/:id', authRequired, eliminarAlmacen);


export default router;