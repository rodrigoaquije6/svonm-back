import { Router } from "express";
import { crearDiagnostico } from "../controllers/diagnosticoController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/montura
router.post('/diagnostico', authRequired, crearDiagnostico);


export default router;