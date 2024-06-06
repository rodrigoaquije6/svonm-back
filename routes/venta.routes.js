import { Router } from "express";
import {
    crearVenta,
    obtenerVenta,
    obtenerVentas
  } from "../controllers/ventaController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/montura
router.post('/venta', authRequired, crearVenta);
router.get('/venta', authRequired, obtenerVentas);
//router.put('/venta/:id', authRequired, actualizarVenta);
//router.delete('/venta/:id', authRequired, eliminarVenta);
router.get('/venta/:id', authRequired, obtenerVenta);

export default router;