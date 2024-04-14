const Montura = require("../models/Montura");

exports.crearMontura = async (req, res) => {
    try {
        let montura;

        //Cramos nuestro rol
        montura = new Montura(req.body);

        await montura.save();
        res.send(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerMonturas = async (req, res) => {
    try {

        const monturas = await Montura.find();
        res.json(monturas)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarMontura = async (req, res) => {
    try {

        let montura = await Montura.findById(req.params.id);

        if(!montura){
            res.status(404).json({ msg: 'No existe la montura' })
        }

        await montura.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Montura eliminada con éxito' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}