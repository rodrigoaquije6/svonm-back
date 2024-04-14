//Rutas para rol
const express = require('express');
const router = express.Router();
const monturaController = require('../controllers/monturaController');

//api/rol

router.post('/', monturaController.crearMontura);
router.get('/', monturaController.obtenerMonturas);
router.delete('/:id', monturaController.eliminarMontura);


module.exports = router;            