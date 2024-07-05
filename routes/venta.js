import { Router } from "express";
import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
  actualizarVenta,
  actualizarEstadoVenta,
  descargarContratoPDF,
  generarCsvVentasDeHoy,
  generarCsvVentasDeEsteMes,
  generarCsvVentasDeEsteAnio,
  obtenerVentasMesActual,
} from "../controllers/ventaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationVenta from "../validation/ventaValidator.js";

const router = Router();

router.post('/venta', authRequired, validationVenta(), crearVenta);
router.get('/venta', authRequired, obtenerVentas);
router.put('/venta/:id', authRequired, validationVenta(), actualizarVenta);
router.put('/venta/:id/estado', authRequired, actualizarEstadoVenta);
router.get('/venta/:id', authRequired, obtenerVenta);
router.get('/venta/:id/descargar-contrato', descargarContratoPDF);
router.get('/venta/mes-actual/total', obtenerVentasMesActual);
router.get('/venta/ventasDeHoy/csv', generarCsvVentasDeHoy);
router.get('/venta/ventasEsteMes/csv', generarCsvVentasDeEsteMes);
router.get('/venta/ventasEsteAnio/csv', generarCsvVentasDeEsteAnio);

export default router;