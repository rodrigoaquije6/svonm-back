import Diagnostico from "../models/V-Diagnostico.js";

export const crearDiagnostico = async(req,res) =>{
    try{
        const{fila, malestar, problema} = req.body;
        const nuevodiagnostico= new Diagnostico({
            fila,
            malestar,
            problema
        });

        await nuevodiagnostico.save();
        res.status(201).json(nuevodiagnostico);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }   

}