import { Router } from "express";
import {
    crearTratamiento,
    obtenerTratamiento,
    obtenerTratamientos,
    actualizarTratamiento,
    eliminarTratamiento
  } from "../controllers/tratamientoController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationLuna from "../validation/lunaValidator.js";

const router = Router();

  router.post('/tratamiento', authRequired, crearTratamiento);
  router.get('/tratamiento', authRequired, obtenerTratamientos);
  router.put('/tratamiento/:id', authRequired, actualizarTratamiento);
  router.get('/tratamiento/:id', authRequired, obtenerTratamiento);
  router.delete('/tratamiento/:id', authRequired, eliminarTratamiento);

export default router;