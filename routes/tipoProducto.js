import { Router } from "express";
import {
    crearTipoProducto,
    obtenerTipoProducto,
    obtenerTiposProducto,
    eliminarTipoProducto,
    actualizarTipoProducto
} from "../controllers/tipoProductoController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTipoProducto from "../validation/tipoProductoValidator.js";

const router = Router();

router.post('/tipoProducto', authRequired, validationTipoProducto(), crearTipoProducto);
router.get('/tipoProducto', authRequired, obtenerTiposProducto);
router.put('/tipoProducto/:id', authRequired, validationTipoProducto(), actualizarTipoProducto);
router.get('/tipoProducto/:id', authRequired, obtenerTipoProducto);
router.delete('/tipoProducto/:id', authRequired, eliminarTipoProducto);

/*router.post('/', tipoProductoController.crearTipoProducto);
router.get('/', tipoProductoController.obtenerTiposProducto);
router.put('/:id', rolController.actualizarTipoProducto);
router.get('/:id', rolController.obtenerTipoProducto);
router.delete('/:id', tipoProductoController.eliminarTipoProducto);*/

export default router;