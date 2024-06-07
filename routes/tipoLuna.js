import { Router } from "express";
import {
    crearNombreLuna,
    obtenerNombreLuna,
    obtenerNombreLunas,
    eliminarNombreLuna
  } from "../controllers/lunaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationLuna from "../validation/lunaValidator.js";

const router = Router();

  router.post('/luna', authRequired, validationLuna(), crearNombreLuna);
  router.get('/luna', authRequired, obtenerNombreLunas);
  router.get('/luna/:id', authRequired, obtenerNombreLuna);
  router.delete('/luna/:id', authRequired, eliminarNombreLuna);

export default router;