import { Router } from "express";
import {
    obtenerProducto,
    obtenerProductos
  } from "../controllers/productoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/montura
//router.post('/producto', authRequired, crearVenta);
router.get('/producto', authRequired, obtenerProductos);
//router.put('/venta/:id', authRequired, actualizarVenta);
//router.delete('/venta/:id', authRequired, eliminarVenta);
router.get('/producto/:id', authRequired, obtenerProducto);

export default router;