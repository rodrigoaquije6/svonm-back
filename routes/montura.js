//Rutas para rol
const express = require('express');
const router = express.Router();
const monturaController = require('../controllers/monturaController');

//api/montura
router.post('/', monturaController.crearMontura);
router.get('/', monturaController.obtenerMonturas);
router.put('/:id', monturaController.actualizarMontura);
router.delete('/:id', monturaController.eliminarMontura);
router.get('/:id', monturaController.obtenerMontura);

module.exports = router;            