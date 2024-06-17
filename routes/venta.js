import { Router } from "express";
import {
    crearVenta,
    obtenerVentas,
    obtenerVenta,
    actualizarVenta,
  } from "../controllers/ventaController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

  router.post('/venta', authRequired, (req, res) => {
    console.log('Solicitud POST a /venta recibida');
    crearVenta(req, res);
  });
  router.get('/venta', authRequired, obtenerVentas);
  router.put('/venta/:id', authRequired, actualizarVenta);
  router.get('/venta/:id', authRequired, obtenerVenta);

export default router;