/*import { Router } from "express";
import {
    crearLenteSol,
    obtenerLenteSol,
    obtenerLentesSol,
    actualizarLenteSol,
    eliminarLenteSol
  } from "../controllers/lenteSolController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationLenteSol from "../validation/lenteSolValidator.js";

const router = Router();

//api/lenteSol
router.post('/lenteSol', authRequired, validationLenteSol(), crearLenteSol);
router.get('/lenteSol', authRequired, obtenerLentesSol);
router.put('/lenteSol/:id', authRequired, validationLenteSol(), actualizarLenteSol);
router.delete('/lenteSol/:id', authRequired, eliminarLenteSol);
router.get('/lenteSol/:id', authRequired, obtenerLenteSol);

export default router;*/