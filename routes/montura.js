import { Router } from "express";
import {
    crearMontura,
    obtenerMontura,
    obtenerMonturas,
    actualizarMontura,
    eliminarMontura
  } from "../controllers/monturaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationMontura from "../validation/monturaValidator.js";

const router = Router();

//api/montura
router.post('/montura', authRequired, validationMontura(), crearMontura);
router.get('/montura', authRequired, obtenerMonturas);
router.put('/montura/:id', authRequired, validationMontura(), actualizarMontura);
router.delete('/montura/:id', authRequired, eliminarMontura);
router.get('/montura/:id', authRequired, obtenerMontura);

export default router;