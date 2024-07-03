import { Router } from "express";
import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
  actualizarVenta,
  actualizarEstadoVenta,
  descargarContratoPDF,
  generarCsvVentasDeHoy,
  obtenerVentasMesActual
} from "../controllers/ventaController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/venta', authRequired, crearVenta);
router.get('/venta', authRequired, obtenerVentas);
router.put('/venta/:id', authRequired, actualizarVenta);
router.put('/venta/:id/estado', authRequired, actualizarEstadoVenta);
router.get('/venta/:id', authRequired, obtenerVenta);
router.get('/venta/:id/descargar-contrato', descargarContratoPDF);
router.get('/venta/ventasDeHoy/csv', generarCsvVentasDeHoy);
router.get('/venta/mes-actual', obtenerVentasMesActual);

export default router;