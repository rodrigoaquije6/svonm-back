//Rutas para rol
const express = require('express');
const router = express.Router();
const tipoProductoController = require('../controllers/tipoProductoController');

//api/rol
router.post('/', tipoProductoController.crearTipoProducto);
router.get('/', tipoProductoController.obtenerTiposProducto);
//router.put('/:id', rolController.actualizarTipoProducto);
//router.get('/:id', rolController.obtenerTipoProducto);
router.delete('/:id', tipoProductoController.eliminarTipoProducto);

module.exports = router;