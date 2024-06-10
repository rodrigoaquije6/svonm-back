import { Router } from "express";
import {
    crearCliente,
    obtenerCliente,
    obtenerClientes,
    actualizarCliente,
    eliminarCliente
} from "../controllers/clienteController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//api/cliente
router.post('/cliente', authRequired, crearCliente);
router.get('/cliente', authRequired, obtenerClientes);
router.put('/cliente/:id', authRequired, actualizarCliente);
router.delete('/cliente/:id', authRequired, eliminarCliente);
router.get('/cliente/:id', authRequired, obtenerCliente);

export default router;