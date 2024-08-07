import { Router } from "express";
import {
    crearCliente,
    obtenerCliente,
    obtenerClientes,
    actualizarCliente,
    eliminarCliente,
    generarHistorialClienteExcel
} from "../controllers/clienteController.js";
import { authRequired } from "../middlewares/validateToken.js";
import clienteValidator from "../validation/clienteValidator.js";

const router = Router();

//api/cliente
router.post('/cliente', authRequired, clienteValidator(), crearCliente);
router.get('/cliente', authRequired, obtenerClientes);
router.put('/cliente/:id', authRequired, clienteValidator(), actualizarCliente);
router.delete('/cliente/:id', authRequired, eliminarCliente);
router.get('/cliente/:id', authRequired, obtenerCliente);
router.get('/cliente/:id/historial-cliente', generarHistorialClienteExcel);


export default router;