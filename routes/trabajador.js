const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/trabajadorController');

//api/trabajador
router.post('/', trabajadorController.crearTrabajador);
router.get('/', trabajadorController.obtenerTrabajadores);
router.put('/:id', trabajadorController.actualizarTrabajador);
router.delete('/:id', trabajadorController.eliminarTrabajador);
router.get('/:id', trabajadorController.obtenerTrabajador);

module.exports = router;