//Rutas para marca
const express = require('express')
const router = express.Router();
const crearmarcaController = require('../controllers/crear-marcaController')

//api/marcas
router.post('/',crearmarcaController.crearMarca);
router.get('/',crearmarcaController.obtenerMarcas);
//router.put('/:id',crearmarcaController.actualizarMarca);
//router.get('/:id',crearmarcaController.obtenerMarca);
router.delete('/:id',crearmarcaController.eliminarMarca);

module.exports=router;