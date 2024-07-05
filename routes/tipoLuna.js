import { Router } from "express";
import {
    crearTipoLuna,
    obtenerTipoLuna,
    obtenerTipoLunas,
    actualizarTipoLuna,
    eliminarTipoLuna
  } from "../controllers/tipoLunaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTipoLuna from "../validation/tipoLunaValidator.js";

const router = Router();

  router.post('/tipoLuna', authRequired, validationTipoLuna(), crearTipoLuna);
  router.get('/tipoLuna', authRequired, obtenerTipoLunas);
  router.put('/tipoLuna/:id', authRequired, validationTipoLuna(), actualizarTipoLuna);
  router.get('/tipoLuna/:id', authRequired, obtenerTipoLuna);
  router.delete('/tipoLuna/:id', authRequired, eliminarTipoLuna);

export default router;