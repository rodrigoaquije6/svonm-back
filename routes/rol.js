//Rutas para rol
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

//api/rol
router.post('/', rolController.crearRol);
router.get('/', rolController.obtenerRoles);
router.put('/:id', rolController.actualizarRol);
router.delete('/:id', rolController.eliminarRol);
router.get('/:id', rolController.obtenerRol);

module.exports = router;