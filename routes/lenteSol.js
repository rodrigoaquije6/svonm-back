import { Router } from "express";
import {
    crearLenteSol,
    obtenerLenteSol,
    obtenerLentesSol,
    actualizarLenteSol,
    eliminarLenteSol
  } from "../controllers/lenteSolController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/lenteSol
router.post('/lenteSol', authRequired, crearLenteSol);
router.get('/lenteSol', authRequired, obtenerLentesSol);
router.put('/lenteSol/:id', authRequired, actualizarLenteSol);
router.delete('/lenteSol/:id', authRequired, eliminarLenteSol);
router.get('/lenteSol/:id', authRequired, obtenerLentesSol);

export default router;