import { Router } from "express";
import {
    crearRol,
    obtenerRoles,
    eliminarRol
  } from "../controllers/rolController.js";
import { authRequired } from "../middlewares/validateToken.js";


const router = Router();

//Renzo: para que no se rompa el funcionamiento de rol:
router.post('/rol', authRequired, crearRol);
router.get('/rol', authRequired, obtenerRoles);
//router.put('/:id', rolController.actualizarRol);
//router.get('/:id', rolController.obtenerRol);
router.delete('/rol/:id', authRequired, eliminarRol);

export default router;

// / / / / Renzo: Este codigo podría quedar deprecado

// //Rutas para rol
// const express = require('express');
// const router = express.Router();
// const rolController = require('../controllers/rolController');

// //api/rol
// router.post('/', rolController.crearRol);
// router.get('/', rolController.obtenerRoles);
// //router.put('/:id', rolController.actualizarRol);
// //router.get('/:id', rolController.obtenerRol);
// router.delete('/:id', rolController.eliminarRol);

// module.exports = router;
