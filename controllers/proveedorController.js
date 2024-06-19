import { coerce } from "zod";
import Proveedor from "../models/proveedor.js";

export const crearProveedor = async (req, res) => {
    try {
        let proveedor;

        //Cramos nuestro proveedor
        proveedor = new Proveedor(req.body);

        await proveedor.save();
        res.send(proveedor);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProveedores = async (req, res) => {
    try {

        const proveedores = await Proveedor.find();
        res.json(proveedores)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerProveedor = async (req, res) => {
    try {

        let proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            res.status(404).json({ msg: 'No existe el proveedor' })
        }

        res.json(proveedor);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarProveedor = async (req, res) => {
    try {

        const { ruc, nombre, nombreContacto, apellidoContacto, telefono, direccion, correo, estado } = req.body;
        let proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            res.status(404).json({ msg: 'No existe el proveedor' })
        }

        proveedor.ruc = ruc,
        proveedor.nombre = nombre,
        proveedor.nombreContacto = nombreContacto,
        proveedor.apellidoContacto = apellidoContacto,
        proveedor.telefono = telefono,
        proveedor.direccion = direccion,
        proveedor.correo = correo,
        proveedor.estado = estado,

        proveedor = await Proveedor.findOneAndUpdate({ _id: req.params.id }, proveedor, { new: true })
        res.json(proveedor);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarProveedor = async (req, res) => {
    try {

        let proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            res.status(404).json({ msg: 'No existe el proveedor' })
        }

        await proveedor.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Proveedor eliminado con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}