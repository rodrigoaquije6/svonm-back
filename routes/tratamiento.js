import { Router } from "express";
import {
    crearTratamiento,
    obtenerTratamiento,
    obtenerTratamientos,
    actualizarTratamiento,
    eliminarTratamiento
  } from "../controllers/tratamientoController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTratamiento from "../validation/tratamientosValidator.js";

const router = Router();

  router.post('/tratamiento', authRequired, validationTratamiento(), crearTratamiento);
  router.get('/tratamiento', authRequired, obtenerTratamientos);
  router.put('/tratamiento/:id', authRequired, validationTratamiento(), actualizarTratamiento);
  router.get('/tratamiento/:id', authRequired, obtenerTratamiento);
  router.delete('/tratamiento/:id', authRequired, eliminarTratamiento);

export default router;