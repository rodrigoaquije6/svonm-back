import Venta from "../models/Venta.js";

export const crearVenta = async (req, res) => {
    try {
        // Extraer los datos de la venta del cuerpo de la solicitud
        const { 
        nombreCliente,
        fechaVenta,
        celCliente,
        dirCliente,
        fijCliente,
        corrCliente,
    ///////////////
        odEsfera,
        odClindro,
        odEje,
        odAVLejos,
        odAVCerca,
    //////////////
        oiEsfera,
        oiClindro,
        oiEje,
        oiAVLejos,
        oiAVCerca,
    /////////////
        odAdd,
        odAltura,
        odCurva,
    //////////////
        oiAdd,
        oiAltura,
        oiCurva,
    ///////////
        DipLejos,
        DipCerca,
    ///////////
        observaciones,
        optometra,
        fechaEntrega,
        vendedor,
        total,
        acuenta,
        saldo,
    /////////
        tipoLuna,
        matLuna,
    /////////
        conSeguimiento,
        tratamientos,
        productos} = req.body;

        // Crear una nueva instancia de Venta con los datos proporcionados
        const nuevaVenta = new Venta({
            nombreCliente,
            fechaVenta,
            celCliente,
            dirCliente,
            fijCliente,
            corrCliente,
            odEsfera,
            odClindro,
            odEje,
            odAVLejos,
            odAVCerca,
            oiEsfera,
            oiClindro,
            oiEje,
            oiAVLejos,
            oiAVCerca,
            odAdd,
            odAltura,
            odCurva,
            oiAdd,
            oiAltura,
            oiCurva,
            DipLejos,
            DipCerca,
            observaciones,
            optometra,
            fechaEntrega,
            vendedor,
            total,
            acuenta,
            saldo,
            tipoLuna,
            matLuna,
            conSeguimiento,
            tratamientos,
            productos
        });

        // Guardar la montura en la base de datos
        await nuevaVenta.save();

        // Devolver la montura guardada como respuesta
        res.json(nuevaVenta);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/*export const actualizarMontura = async (req, res) => {
    try {

        const { codigo, tipoProducto, nombre, precio, imagen, marca, color, genero, forma  } = req.body;
        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        montura.codigo = codigo,
        montura.tipoProducto = tipoProducto,
        montura.nombre = nombre,
        montura.precio = precio,
        montura.imagen = imagen,
        montura.marca = marca,
        montura.color = color,
        montura.genero = genero,
        montura.forma = forma
        

        montura = await Montura.findOneAndUpdate({ _id: req.params.id }, montura, { new: true })
        res.json(montura);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/

export const obtenerVentas = async (req, res) => {
    try {

        const ventas = await Venta.find();
        res.json(ventas)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

export const obtenerVenta = async (req, res) => {
    try {

        let venta = await Venta.findById(req.params.id);

        if (!venta) {
            res.status(404).json({ msg: 'No existe la venta' })
        }

        res.json(venta);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

/*export const eliminarMontura = async (req, res) => {
    try {

        let montura = await Montura.findById(req.params.id);

        if (!montura) {
            res.status(404).json({ msg: 'No existe la montura' })
        }

        await montura.deleteOne({ _id: req.params.id })
        res.json({ msg: 'Montura eliminada con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}*/