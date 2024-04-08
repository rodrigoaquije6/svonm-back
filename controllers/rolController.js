const Rol = require("../models/rol");

exports.crearRol = async (req, res) => {
    try {
        let rol;

        //Cramos nuestro rol
        rol = new Rol(req.body);

        await rol.save();
        res.send(rol);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerRoles = async (req, res) => {
    try {

        const roles = await Rol.find();
        res.json(roles)
        
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

exports.eliminarRol = async (req, res) => {
    try {

        let rol = await Rol.findById(req.params.id);

        if(!rol){
            res.status(404).json({ msg: 'No existe el producto' })
        }

        await rol.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Rol eliminado con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}