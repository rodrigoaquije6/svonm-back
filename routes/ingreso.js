import { Router } from "express";
import {
    crearIngreso,
    obtenerIngresos,
    obtenerIngreso,
    actualizarIngreso,
    actualizarEstadoIngreso,
    descargarPDFIngreso,
    ejecutarAutomatizacion,
    obtenerProveedoresConProductos
} from "../controllers/ingresoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/ingreso', authRequired, crearIngreso);
router.get('/ingreso', authRequired, obtenerIngresos);
router.put('/ingreso/:id', authRequired, actualizarIngreso);
router.put('/ingreso/:id/estado', actualizarEstadoIngreso);
router.get('/ingreso/:id', authRequired, obtenerIngreso);
router.get('/ingreso/:id/descargar-contrato', descargarPDFIngreso);
router.post('/ingreso/automatizar-orden-compra', ejecutarAutomatizacion);
router.get('/ingreso/productos-proveedor/abastecer', obtenerProveedoresConProductos);

export default router;