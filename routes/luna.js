import { Router } from "express";
import {
    crearLuna,
    obtenerLuna,
    obtenerLunas,
    actualizarLuna,
    eliminarLuna
  } from "../controllers/lunaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationMaterialLuna from "../validation/materialLunaValidator.js";

const router = Router();

  router.post('/luna', authRequired, validationMaterialLuna(), crearLuna);
  router.get('/luna', authRequired, obtenerLunas);
  router.put('/luna/:id', authRequired, validationMaterialLuna(), actualizarLuna);
  router.get('/luna/:id', authRequired, obtenerLuna);
  router.delete('/luna/:id', authRequired, eliminarLuna);

export default router;