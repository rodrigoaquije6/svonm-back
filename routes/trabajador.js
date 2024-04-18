import { Router } from "express";
import {
    crearTrabajador,
    obtenerTrabajador,
    obtenerTrabajadores,
    actualizarTrabajador,
    eliminarTrabajador
  } from "../controllers/trabajadorController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/trabajador
router.post('/trabajador', authRequired, crearTrabajador);
router.get('/trabajador', authRequired, obtenerTrabajadores);
router.put('/trabajador/:id', authRequired, actualizarTrabajador);
router.delete('/trabajador/:id', authRequired, eliminarTrabajador);
router.get('/trabajador/:id', authRequired, obtenerTrabajador);

export default router;