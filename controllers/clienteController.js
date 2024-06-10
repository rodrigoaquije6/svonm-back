import Cliente from "../models/cliente.js";

export const crearCliente = async (req, res) => {
    try {
        let cliente;

        //Cramos nuestro trabajador
        cliente = new Cliente(req.body);

        await cliente.save();
        res.send(cliente);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerClientes = async (req, res) => {
    try {

        const clientes = await Cliente.find();
        res.json(clientes)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerCliente = async (req, res) => {
    try {

        let cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            res.status(404).json({ msg: 'No existe el cliente' })
        }

        res.json(cliente);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const actualizarCliente = async (req, res) => {
    try {

        const { dni, nombres, apellidos, celular, direccion, correo, estado } = req.body;
        let cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            res.status(404).json({ msg: 'No existe el cliente' })
        }

        cliente.dni = dni,
        cliente.nombres = nombres,
        cliente.apellidos = apellidos,
        cliente.celular = celular,
        cliente.direccion = direccion,
        cliente.correo = correo,
        cliente.estado = estado

        cliente = await Cliente.findOneAndUpdate({ _id: req.params.id }, cliente, { new: true })
        res.json(cliente);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const eliminarCliente = async (req, res) => {
    try {

        let cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            res.status(404).json({ msg: 'No existe el cliente' })
        }

        await cliente.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Cliente eliminado con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}