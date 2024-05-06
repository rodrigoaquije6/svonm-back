import { Router } from "express";
import {
    crearLuna,
    obtenerLuna,
    obtenerLunas,
    actualizarLuna,
    eliminarLuna
  } from "../controllers/lunaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationLuna from "../validation/lunaValidator.js";

const router = Router();

router.post('/luna', authRequired, validationLuna(), crearLuna);
router.get('/luna', authRequired, obtenerLunas);
router.put('/luna/:id', authRequired, validationLuna(), actualizarLuna);
router.get('/luna/:id', authRequired, obtenerLuna);
router.delete('/luna/:id', authRequired, eliminarLuna);

export default router;