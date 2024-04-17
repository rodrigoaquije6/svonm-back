const Trabajador = require("../models/Trabajador")

exports.crearTrabajador = async (req, res) => {
    try {
        let trabajador;

        //Cramos nuestro trabajador
        trabajador = new Trabajador(req.body);

        await trabajador.save();
        res.send(trabajador);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerTrabajadores = async (req, res) => {
    try {

        const trabajadores = await Trabajador.find();
        res.json(trabajadores)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/*exports.actualizarRol = async (req, res) => {
    try {

        const { nombre } = req.body;
        let rol = await Rol.findById(req.params.id);

        if(!rol){
            res.status(404).json({ msg: 'No existe el producto' })
        }

        rol.nombre = nombre;

        rol = await Rol.findOneAndUpdate({ _id: req.params.id }, rol, { new: true })
        res.json(rol);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerRol = async (req, res) => {
    try {

        let rol = await Rol.findById(req.params.id);

        if(!rol){
            res.status(404).json({ msg: 'No existe el producto' })
        }

        res.json(rol);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/

exports.eliminarTrabajador = async (req, res) => {
    try {

        let trabajador = await Trabajador.findById(req.params.id);

        if(!trabajador){
            res.status(404).json({ msg: 'No existe el producto' })
        }

        await trabajador.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Trabajador eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}