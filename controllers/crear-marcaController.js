const crearMarca = require("../models/Crear-marca");

exports.crearMarca = async(req,res) => {
try {
    let marca;

    //creamos marca

    marca = new crearMarca(req.body);

    await marca.save();
    res.send(marca);



} catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
}
}

exports.obtenerMarcas = async (req,res) => {
    try {
        
        const marcas = await crearMarca.find();
        res.json(marcas)


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/*exports.actualizarMarca = async (req,res) => {
    try {
        
        const {codigo,marca} = req.body;
        let marcas = await crearMarca.findById(req.params.id);

        if(!marcas){
            res.status(404).json({msg : 'No existe la marca'})
        }

        marcas.codigo = codigo;
        marcas.marca = marca;

        marcas = await crearMarca.findOneAndUpdate({ _id:req.params.id}, marcas, {new:true})
        res.json(marcas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerMarca = async (req,res) => {
    try {
        
        let marcas = await crearMarca.findById(req.params.id);

        if(!marcas){
            res.status(404).json({msg : 'No existe la marca'})
        }

        res.json(marcas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/

exports.eliminarMarca = async (req,res) => {
    try {
        
        let marca = await crearMarca.findById(req.params.id);

        if(!marca){
            res.status(404).json({msg : 'No existe la marca'})
        }

        await crearMarca.deleteOne({ _id:req.params.id})
        res.json({msg: 'Marca eliminada con éxito'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}