import { Router } from "express";
import {
    crearMarca,
    obtenerMarca,
    obtenerMarcas,
    actualizarMarca,
    eliminarMarca
  } from "../controllers/crear-marcaController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validationMarca from "../validation/marcaValidator.js";

const router = Router();

//api/marcas
router.post('/crear-marca', authRequired, validationMarca(), crearMarca);
router.get('/crear-marca', authRequired, obtenerMarcas);
router.put('/crear-marca/:id', authRequired, validationMarca(), actualizarMarca);
router.delete('/crear-marca/:id', authRequired, eliminarMarca);
router.get('/crear-marca/:id', authRequired, obtenerMarca);

export default router;