import { Router } from "express";
import {
  crearProveedor,
  obtenerProveedor,
  obtenerProveedores,
  actualizarProveedor,
  eliminarProveedor
} from "../controllers/proveedorController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTrabajador from "../validation/trabajadorValidator.js";

const router = Router();

router.post('/proveedor', authRequired, crearProveedor);
router.get('/proveedor', authRequired, obtenerProveedores);
router.put('/proveedor/:id', authRequired, actualizarProveedor);
router.delete('/proveedor/:id', authRequired, eliminarProveedor);
router.get('/proveedor/:id', authRequired, obtenerProveedor);

export default router;