//Rutas para rol
const express = require('express');
const router = express.Router();
const TipoProductoController = require('../controllers/tipoProductoController');

//api/rol
router.post('/', TipoProductoController.crearTipoProducto);
router.get('/', TipoProductoController.obtenerTipoProducto);
//router.put('/:id', rolController.actualizarTipoProducto);
//router.get('/:id', rolController.obtenerTipoProducto);
router.delete('/:id', TipoProductoController.eliminarTipoProducto);

module.exports = router;