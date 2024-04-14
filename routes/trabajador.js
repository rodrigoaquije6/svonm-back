const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/trabajadorController');

//router.post('/', () => {
//    console.log();('Creando producto..');
//})
router.post('/', trabajadorController.crearTrabajador);
router.get('/', trabajadorController.obtenerTrabajadores);
router.delete('/:id', trabajadorController.eliminarTrabajador);

module.exports = router;