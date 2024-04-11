const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/trabajadorController');

router.post('/', trabajadorController.crearTrabajador);
router.get('/', trabajadorController.obtenerTrabajador);
router.delete('/:id', trabajadorController.eliminarTrabajador);

module.exports = router;