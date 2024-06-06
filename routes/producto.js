import { Router } from "express";
import {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto
  } from "../controllers/productoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/producto
router.post('/producto', authRequired, crearProducto);
router.get('/producto', authRequired, obtenerProductos);
router.put('/producto/:id', authRequired, actualizarProducto);
//router.delete('/montura/:id', authRequired, eliminarMontura);
router.get('/producto/:id', authRequired, obtenerProducto);

export default router;