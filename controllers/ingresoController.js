import Ingreso from "../models/ingresos.js";
import DetalleIngreso from "../models/detalleIngreso.js";
import Producto from "../models/producto.model.js";
import nodemailer from 'nodemailer';
import Proveedor from "../models/proveedor.js";

// Configuración del transporter (servidor de correo)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia a tu servidor de correo saliente SMTP
    port: 587, // Puerto de correo saliente
    secure: false, // false para TLS; true para SSL
    auth: {
        user: 'rodroaquije062@gmail.com',
        pass: 'giqg ehga mlit zuaf',
    },
});

// Función para enviar el correo electrónico
const enviarCorreoProveedor = async (correoProveedor, ingreso) => {
    try {

        // Configura el mensaje de correo electrónico
        const mailOptions = {
            from: 'rodroaquije062@gmail.com', // Dirección de correo remitente
            to: correoProveedor, // Dirección de correo destinatario
            subject: 'Nueva Orden de Compra Solicitada',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            .header {
                                background-color: #f0f0f0;
                                padding: 10px;
                                text-align: center;
                            }
                            .content {
                                padding: 20px;
                                background-color: #ffffff;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                            }
                            .footer {
                                margin-top: 20px;
                                font-size: 12px;
                                color: #666666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0iaLzfbJLZ4ebBIovMo7vI8KFcBn8YMCkHg&s" alt="Logo de Óptica Nuevo Mundo" class="logo">
                            <h1>¡Nueva Órden de Compra Generada!</h1>
                        </div>
                        <div class="content">
                            <p>Estimado proveedor,</p>
                            <p>Le informamos que se ha generado una nueva orden de compra con los siguientes detalles:</p>
                            <p><strong>Código de Ingreso:</strong> ${ingreso.codigo}</p>
                            <p><strong>Fecha de Registro:</strong> ${new Date(ingreso.fechaCreacion).toLocaleDateString()}</p>
                            <p><strong>Fecha de Entrega Estimada:</strong> ${new Date(ingreso.fechaEntregaEstimada).toLocaleDateString()}</p>
                            <p>Le adjunto la órden de compra en formato pdf. Por favor, esté atento a la fecha de entrega estimada indicada.</p>
                            <p>Gracias por su atención.</p>
                        </div>
                        <div class="footer">
                            <p>Atentamente,<br>Óptica Nuevo Mundo</p>
                        </div>
                    </body>
                </html>
          `,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico', error);
        throw error;
    }
};


const obtenerProximoCodigoIngreso = async () => {
    try {
        // Buscar el último ingreso en la base de datos
        const ultimoIngreso = await Ingreso.findOne().sort({ codigo: -1 }).exec();

        // Si no hay ingresos en la base de datos, comenzar desde 1
        if (!ultimoIngreso) {
            return 'ONMI-1';
        }

        // Extraer el número del código del último Ingreso
        const ultimoCodigoNumerico = parseInt(ultimoIngreso.codigo.split('-')[1]);

        // Construir el próximo código del ingreso
        const proximoCodigoNumerico = ultimoCodigoNumerico + 1;
        return `ONMI-${proximoCodigoNumerico}`;
    } catch (error) {
        throw new Error('Error al obtener el próximo código del ingreso');
    }
};

export const crearIngreso = async (req, res) => {
    try {

        const codigoIngreso = await obtenerProximoCodigoIngreso();

        const {
            observacion, descuento, impuesto, subtotal, total,
            fechaEntregaEstimada, estado, idProveedor, idTrabajador,
            productosAgregados
        } = req.body;

        // Crear el ingreso principal
        const ingreso = new Ingreso({
            codigo: codigoIngreso,
            observacion,
            descuento,
            impuesto,
            subtotal,
            total,
            fechaEntregaEstimada,
            estado,
            idProveedor,
            idTrabajador
        });

        const savedIngreso = await ingreso.save();

        // Crear los detalles del ingreso
        const detalleIngresoPromises = productosAgregados.map(producto => {
            const detalleIngreso = new DetalleIngreso({
                cantidad: producto.cantidad,
                total: producto.total,
                idIngreso: savedIngreso._id,
                idProducto: producto._id
            });
            return detalleIngreso.save();
        });

        // Ejecutar todas las promesas de detalles de ingreso
        await Promise.all(detalleIngresoPromises);

        // Obtener el correo electrónico del proveedor desde la base de datos o el req.body según tu estructura
        const proveedor = await Proveedor.findById(idProveedor);

        if (!proveedor) {
            return res.status(404).json({ message: `Proveedor con ID ${idProveedor} no encontrado` });
        }

        // Enviar correo electrónico al proveedor
        await enviarCorreoProveedor(proveedor.correo, savedIngreso); // Aquí usamos el correo del proveedor

        res.status(201).json({ message: 'Ingreso creado con éxito', ingreso: savedIngreso });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el ingreso', error });
    }
};

export const obtenerIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.find().populate('idProveedor').populate('idTrabajador');

        const ingresosConDetalles = await Promise.all(ingresos.map(async (ingreso) => {
            const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingreso._id }).populate('idProducto');
            return {
                ingreso,
                detallesIngreso
            };
        }));

        res.status(200).json({ ingresosConDetalles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los ingresos', error });
    }
};

export const obtenerIngreso = async (req, res) => {
    try {
        const { id } = req.params;

        const ingreso = await Ingreso.findById(id).populate('idProveedor').populate('idTrabajador');

        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }

        const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingreso._id }).populate('idProducto');

        res.status(200).json({
            ingreso,
            detallesIngreso
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el ingreso', error });
    }
};

export const actualizarIngreso = async (req, res) => {
    try {
        const ingresoId = req.params.id;
        const ingresoActualizado = req.body;

        const ingresoExistente = await Ingreso.findById(ingresoId);

        if (!ingresoExistente) {
            return res.status(404).json({ message: `Ingreso con ID ${ingresoExistente.codigo} no encontrado` });
        }

        await Ingreso.findByIdandUpdate(ingresoId, ingresoActualizado, { new: true });

        res.status(200).json({ message: `Ingreso con ID ${ingresoExistente.codigo} actualizado con éxito`, ingreso: ingresoActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el ingreso', error });
    }
};

export const actualizarEstadoIngreso = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ingresoExistente = await Ingreso.findById(id).populate('idProveedor').populate('idTrabajador');

        if (!ingresoExistente) {
            return res.status(404).json({ message: `El ingreso con ID ${id} no existe` });
        }

        // Si el estado cambia a "Recibido", actualizar el stock de los productos
        if (estado === 'Recibido' && ingresoExistente.estado !== 'Recibido') {
            const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingresoExistente._id }).populate('idProducto');

            const actualizarStockPromises = detallesIngreso.map(async (detalle) => {
                const producto = await Producto.findById(detalle.idProducto);
                if (producto) {
                    producto.stock += detalle.cantidad;
                    await producto.save();
                }
            });

            await Promise.all(actualizarStockPromises);
        }

        // Actualizar el estado del ingreso en la base de datos
        ingresoExistente.estado = estado;
        const ingresoActualizado = await ingresoExistente.save();

        res.status(200).json({ message: `Estado del ingreso actualizado correctamente`, ingreso: ingresoActualizado });
    } catch (error) {
        console.error('Error al actualizar el estado del ingreso:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del ingreso', error });
    }
};