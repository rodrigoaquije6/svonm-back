import { Router } from "express";
import {
    crearTrabajador,
    obtenerTrabajador,
    obtenerTrabajadores,
    actualizarTrabajador,
    eliminarTrabajador
  } from "../controllers/trabajadorController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationTrabajador from "../validation/trabajadorValidator.js";

const router = Router();

//api/trabajador
router.post('/trabajador', authRequired, validationTrabajador(), crearTrabajador);
router.get('/trabajador', authRequired, obtenerTrabajadores);
router.put('/trabajador/:id', authRequired, validationTrabajador(), actualizarTrabajador);
router.delete('/trabajador/:id', authRequired, eliminarTrabajador);
router.get('/trabajador/:id', authRequired, obtenerTrabajador);

export default router;