import Ingreso from "../models/ingresos.js";
import DetalleIngreso from "../models/detalleIngreso.js";
import Producto from "../models/producto.model.js";
import nodemailer from 'nodemailer';
import Proveedor from "../models/proveedor.js";
import Trabajador from "../models/user.model.js";
import pdfkit from 'pdfkit';

export const generarPDFIngreso = async (id) => {
    try {
        const ingreso = await Ingreso.findById(id).populate('idProveedor').populate('idTrabajador');

        if (!ingreso) {
            throw new Error('Ingreso no encontrado');
        }

        const detallesIngreso = await DetalleIngreso.find({ idIngreso: ingreso._id }).populate('idProducto');

        // Crear un nuevo documento PDF en memoria
        const doc = new pdfkit();

        // Construir el contenido del PDF
        doc.font('Helvetica').fontSize(18).text('Óptica NUEVO MUNDO', { align: 'center' });
        doc.fontSize(10).text('Av. Universitaria Norte Mz L1 Lote 8', { align: 'center' });
        doc.text('A.H. Daniel Alcides Carrión', { align: 'center' });
        doc.text('Los Olivos', { align: 'center' });
        doc.text('Teléfono: 01 6788125 / 994648863', { align: 'center' });
        doc.moveDown(1);

        // Título del contrato
        doc.fontSize(14).text('ORDEN DE COMPRA', { align: 'right' });
        doc.fontSize(12).text(`Número: ${ingreso.codigo}`, { align: 'right' });
        doc.text(`Fecha: ${new Date(ingreso.fechaCreacion)?.toLocaleDateString('es-PE', { timeZone: 'UTC' })}`, { align: 'right' });
        doc.text(`Estado: ${ingreso.estado}`, { align: 'right' });
        doc.moveDown(1);

        // Información del Proveedor
        doc.fontSize(12).text('INFORMACIÓN DEL PROVEEDOR', { underline: true });
        doc.moveDown(0.5);
        doc.text(`RUC: ${ingreso.idProveedor?.ruc || 'N/A'}`);
        doc.text(`Nombre: ${ingreso.idProveedor?.nombre || 'N/A'}`);
        doc.text(`Teléfono: ${ingreso.idProveedor?.telefono || 'N/A'}`);
        doc.text(`Correo: ${ingreso.idProveedor?.correo || 'N/A'}`);
        doc.moveDown(0.5);

        doc.moveDown(1);

        // Información de los productos
        doc.fontSize(12).text('PRODUCTO(S)', { underline: true });
        doc.moveDown(0.5);

        // Lista de productos
        detallesIngreso.forEach(detalle => {
            doc.text(`- ${detalle.idProducto?.nombre || 'N/A'}, precio: S/. ${detalle.idProducto?.precio || 'N/A'}, cantidad: ${detalle.cantidad?.toString() || 'N/A'}, total: S/. ${detalle.total?.toFixed(2) || 'N/A'}`);
            doc.moveDown(0.5);
        });

        // Observaciones y montos
        doc.moveDown(1);
        doc.fontSize(12).text('OBSERVACIONES', { underline: true });
        doc.moveDown(0.5);
        doc.text(ingreso?.observacion || 'N/A');
        doc.moveDown(1);

        doc.fontSize(12).text('MONTOS', { underline: true });
        doc.moveDown(0.5);
        doc.text(`SubTotal: S/. ${ingreso.subtotal?.toFixed(2) || 'N/A'}`);
        doc.text(`Descuento: ${ingreso?.descuento || '0'}%`);
        doc.text(`Impuesto: ${ingreso?.impuesto || '0'}%`);
        doc.text(`Total: S/. ${ingreso.total?.toFixed(2) || 'N/A'}`);
        doc.moveDown(1);

        // Fecha entrega estimada
        doc.fontSize(12).text('FECHA DE ENTREGA ESTIMADA', { underline: true });
        doc.moveDown(0.5);
        doc.text(`Fecha de entrega estimada: ${new Date(ingreso.fechaEntregaEstimada)?.toLocaleDateString('es-PE', { timeZone: 'UTC' }) || 'N/A'}`);
        doc.moveDown(1);

        // Información del trabajador
        doc.fontSize(12).text('INFORMACIÓN DEL TRABAJADOR', { underline: true });
        doc.moveDown(0.5);
        doc.text(`Vendedor(a): ${ingreso.idTrabajador?.nombres} ${ingreso.idTrabajador?.apellidos}`);
        doc.moveDown(2);

        // Pie de página
        doc.fontSize(10).text('La lámpara del cuerpo es el ojo; así que, si tu ojo es bueno, todo tu cuerpo estará lleno de luz. Mateo 6:22', { align: 'center' });

        // Finalizar y obtener el buffer del PDF generado
        return await new Promise((resolve, reject) => {
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.end();
        });

    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};

export const descargarPDFIngreso = async (req, res) => {
    try {
        const { id } = req.params;
        const ingreso = await Ingreso.findById(id).populate('idProveedor');

        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }

        // Generar el PDF del ingreso en memoria
        const pdfBuffer = await generarPDFIngreso(id); // Esta función debe devolver un buffer del PDF generado

        if (!pdfBuffer) {
            return res.status(500).json({ message: 'Error al generar el PDF del ingreso' });
        }

        // Preparar la respuesta con el PDF como un Blob
        res.setHeader('Content-Disposition', `attachment; filename="orden-compra-${ingreso.codigo}-${ingreso.idProveedor.nombre}-${ingreso.estado}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error al descargar el PDF del ingreso:', error);
        res.status(500).json({ message: 'Error al descargar el PDF del ingreso', error });
    }
};

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
const enviarCorreoProveedor = async (correoProveedor, idIngreso) => {
    try {
        const ingreso = await Ingreso.findById(idIngreso).populate('idProveedor').populate('idTrabajador');
        if (!ingreso) {
            throw new Error(`Ingreso con ID ${idIngreso} no encontrado`);
        }

        const pdfBuffer = await generarPDFIngreso(idIngreso);

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
                            <p><strong>Fecha de Entrega Estimada:</strong> ${new Date(ingreso.fechaEntregaEstimada).toLocaleDateString('es-PE')}</p>
                            <p>Estamos ubicados en <strong>Av. Universitaria Norte Mz L1 Lote 8, A.H. Daniel Alcides Carrión, Los Olivos</strong></p>
                            <p>Le adjunto la órden de compra en formato pdf. Por favor esté atento a la fecha de entrega estimada indicada.</p>
                            <p>Gracias por su atención.</p>
                        </div>
                        <div class="footer">
                            <p>Atentamente,<br>Óptica Nuevo Mundo</p>
                        </div>
                    </body>
                </html>
          `,
            attachments: [
                {
                    filename: `orden-compra-${ingreso.codigo}-${ingreso.idProveedor.nombre}-${ingreso.estado}.pdf`,
                    content: pdfBuffer,
                },
            ],
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo con el PDF adjunto:', error);
        throw error;
    }
};

const obtenerProximoCodigoIngreso = async () => {
    try {
        // Buscar el último ingreso en la base de datos
        const ultimoIngreso = await Ingreso.findOne({ codigo: { $regex: /^ONMI-\d{5}$/ } })
            .sort({ codigo: -1 })
            .exec();

        let proximoCodigoNumerico;
        if (!ultimoIngreso) {
            proximoCodigoNumerico = 1;
        } else {
            // Extraer el número del código de la última venta
            const ultimoCodigoNumerico = parseInt(ultimoIngreso.codigo.split('-')[1]);
            proximoCodigoNumerico = ultimoCodigoNumerico + 1;
        }

        // Formatear el próximo código de venta con ceros a la izquierda
        const proximoCodigo = `ONMI-${proximoCodigoNumerico.toString().padStart(5, '0')}`;
        return proximoCodigo;
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

        // Generar y enviar correo electrónico con PDF adjunto
        await Promise.all([
            generarPDFIngreso(savedIngreso._id), // Genera el PDF del ingreso
            enviarCorreoProveedor(proveedor.correo, savedIngreso._id) // Envía correo con PDF adjunto
        ]);

        res.status(201).json({ message: 'Ingreso creado con éxito', ingreso: savedIngreso });
    } catch (error) {
        console.error('Error al crear el ingreso:', error);
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

export const ejecutarAutomatizacion = async (req, res) => {
    try {
        const { trabajadorId, descuento } = req.body;
        const trabajador = await Trabajador.findById(trabajadorId);

        if (!trabajador) {
            return res.status(404).json({ message: `Trabajador con ID ${trabajadorId} no encontrado` });
        }

        await automatizarOrdenesCompra(trabajador, descuento);
        res.status(200).json({ message: 'Automatización de órdenes de compra completada con éxito.' });
    } catch (error) {
        console.error('Error al ejecutar automatización:', error);
        res.status(500).json({ message: 'Error al ejecutar automatización de órdenes de compra.', error });
    }
};

// Función para automatizar órdenes de compra
export const automatizarOrdenesCompra = async (trabajador, descuento) => {
    try {
        const fechaActual = new Date();
        const fechaProximaSemana = new Date(fechaActual);
        fechaProximaSemana.setDate(fechaProximaSemana.getDate() + 7);

        const productosNearMinStock = await Producto.find({
            $expr: {
                $lte: [
                    "$stock",
                    { $add: ["$stockMinimo", 1] }
                ]
            },
            estado: 'Activo'
        }).populate('proveedor');

        // Objeto para agrupar productos por proveedor
        const ordenesPorProveedor = {};

        // Iterar sobre los productos y agrupar por proveedor
        productosNearMinStock.forEach(producto => {
            const proveedorId = producto.proveedor._id.toString();

            if (!ordenesPorProveedor[proveedorId]) {
                ordenesPorProveedor[proveedorId] = {
                    proveedor: producto.proveedor,
                    productos: []
                };
            }

            // Calcular la cantidad a ordenar
            const cantidadOrdenar = Math.max(0, 5 - producto.stock);

            // Agregar producto a la lista del proveedor
            ordenesPorProveedor[proveedorId].productos.push({
                productoId: producto._id,
                cantidad: cantidadOrdenar,
                precio: producto.precio
            });
        });

        // Array para almacenar las promesas de generación de PDF y envío de correo
        const promises = [];

        // Iterar sobre las órdenes por proveedor y generar las órdenes de compra
        for (const proveedorId in ordenesPorProveedor) {
            const ordenProveedor = ordenesPorProveedor[proveedorId];

            // Calcular subtotal y total para la orden de compra del proveedor
            let subtotalOrdenProveedor = 0;

            ordenProveedor.productos.forEach(detalleProducto => {
                subtotalOrdenProveedor += detalleProducto.cantidad * detalleProducto.precio;
            });

            const impuesto = 18;
            const totalOrdenProveedor = subtotalOrdenProveedor * (1 + impuesto / 100) * (1 - descuento / 100);

            // Crear el ingreso para la orden de compra
            const codigoIngreso = await obtenerProximoCodigoIngreso(); // Asumiendo que tienes una función para obtener el próximo código de ingreso

            const ingreso = new Ingreso({
                codigo: codigoIngreso,
                observacion: 'Por favor respetar la fecha de entrega estimada. ¡Muchas Gracias!',
                descuento: descuento,
                impuesto: impuesto,
                subtotal: subtotalOrdenProveedor,
                total: totalOrdenProveedor,
                fechaEntregaEstimada: fechaProximaSemana,
                estado: 'Pendiente',
                idProveedor: ordenProveedor.proveedor._id,
                idTrabajador: trabajador._id,
            });

            const savedIngreso = await ingreso.save();

            // Crear detalles de ingreso para los productos del proveedor
            for (const detalleProducto of ordenProveedor.productos) {
                const detalleIngreso = new DetalleIngreso({
                    cantidad: detalleProducto.cantidad,
                    total: detalleProducto.cantidad * detalleProducto.precio,
                    idIngreso: savedIngreso._id,
                    idProducto: detalleProducto.productoId,
                });

                await detalleIngreso.save();
            }

            // Generar el PDF del ingreso y enviar correo electrónico al proveedor
            promises.push(
                generarPDFIngreso(savedIngreso._id), // Asumiendo que generas el PDF con esta función
                enviarCorreoProveedor(ordenProveedor.proveedor.correo, savedIngreso._id) // Asumiendo que envías el correo con esta función
            );
        }

        await Promise.all(promises);

        console.log('Órdenes de compra automáticas generadas con éxito.');
    } catch (error) {
        console.error('Error al generar órdenes de compra automáticas:', error);
        throw error;
    }
};