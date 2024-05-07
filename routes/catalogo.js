import { Router } from "express";
import {
    obtenerCatalogo,
    obtenerCatalogos,
  } from "../controllers/CatalogoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/catalogo
router.get('/catalogo', authRequired,obtenerCatalogos);
router.get('/catologo/:id', authRequired, obtenerCatalogo);

export default router;