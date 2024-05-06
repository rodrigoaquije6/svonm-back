import { Router } from "express";
import {
  crearRol,
  obtenerRol,
  obtenerRoles,
  eliminarRol,
  actualizarRol,

} from "../controllers/rolController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationRol from "../validation/rolValidator.js";


const router = Router();

router.post('/rol', authRequired, validationRol(), crearRol);
router.get('/rol', authRequired, obtenerRoles);
router.put('/rol/:id', authRequired, validationRol(), actualizarRol);
router.get('/rol/:id', authRequired, obtenerRol);
router.delete('/rol/:id', authRequired, eliminarRol);

/*router.post('/',rolController.crearRol)
router.put('/:id', rolController.actualizarRol)
router.get('/', rolController.obtenerRoles);
router.delete('/:id', rolController.eliminarRol);
router.get('/:id', rolController.obtenerRol);*/

export default router;