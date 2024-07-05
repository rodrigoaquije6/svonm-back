import { Router } from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  obtenerProductosPorProveedor,
  obtenerProductosActivos,
  actualizarEstadoProducto,
  eliminarProducto
} from "../controllers/productoController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationProductos from "../validation/productoValidator.js";

const router = Router();

//api/producto
router.post('/producto', authRequired, validationProductos(), crearProducto);
router.get('/producto', authRequired, obtenerProductos);
router.get('/producto/activos', authRequired, obtenerProductosActivos);
router.put('/producto/:id', authRequired, validationProductos(), actualizarProducto);
router.delete('/producto/:id', authRequired, eliminarProducto);
router.get('/producto/:id', authRequired, obtenerProducto);
router.get('/producto/proveedor/:idProveedor', authRequired, obtenerProductosPorProveedor);
router.put('/producto/:id/estado', actualizarEstadoProducto);

export default router;