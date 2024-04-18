import { Router } from "express";
import {
    crearMontura,
    obtenerMontura,
    obtenerMonturas,
    actualizarMontura,
    eliminarMontura
  } from "../controllers/monturaController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/montura
router.post('/montura', authRequired, crearMontura);
router.get('/montura', authRequired, obtenerMonturas);
router.put('/montura/:id', authRequired, actualizarMontura);
router.delete('/montura/:id', authRequired, eliminarMontura);
router.get('/montura/:id', authRequired, obtenerMontura);

export default router;