//Rutas para marca
const express = require('express')
const router = express.Router();
const crearmarcaController = require('../controllers/crear-marcaController')

//api/marcas
router.post('/',crearmarcaController.crearMarca);
router.get('/',crearmarcaController.obtenerMarcas);
router.put('/:id',crearmarcaController.actualizarMarca);
router.delete('/:id',crearmarcaController.eliminarMarca);
router.get('/:id', crearmarcaController.obtenerMarca);

module.exports=router;