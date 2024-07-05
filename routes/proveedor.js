import { Router } from "express";
import {
  crearProveedor,
  obtenerProveedor,
  obtenerProveedores,
  actualizarProveedor,
  eliminarProveedor
} from "../controllers/proveedorController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationProveedor from "../validation/proveedorValidator.js";

const router = Router();

router.post('/proveedor', authRequired, validationProveedor(), crearProveedor);
router.get('/proveedor', authRequired, obtenerProveedores);
router.put('/proveedor/:id', authRequired, validationProveedor(), actualizarProveedor);
router.delete('/proveedor/:id', authRequired, eliminarProveedor);
router.get('/proveedor/:id', authRequired, obtenerProveedor);

export default router;