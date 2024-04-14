const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Ruta para crear un nuevo producto
router.post('/', productoController.crearProducto);

module.exports = router;