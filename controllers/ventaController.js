import DetalleTratamiento from "../models/detalleTratamiento.js";
import DetalleVenta from "../models/detalleVenta.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.js";
import Cliente from "../models/cliente.js"
import Devolucion from "../models/devolucion.js";
import DetalleDevolucion from "../models/detalleDevolucion.js";
import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import pdfkit from 'pdfkit';
import { format } from 'date-fns';
import { createObjectCsvWriter } from 'csv-writer';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'digfact-urp-jesuslluen-421602',
  keyFilename: 'E:\\PROYECTOS\\digfact-urp-jesuslluen-421602-1798149ad24a.json'
});

const bucketName = 'lnd-urp-prueba2-bucket-bigquery-aquijerodrigo';
const destinationFilename = 'ventasDeHoy.csv';
const downloadsDir = path.join(os.homedir(), 'Downloads');

export const generarCsvVentasDeHoy = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const ventasDeHoy = await Venta.find({
      fechaCreacion: {
        $gte: hoy,
        $lt: mañana
      }
    }).populate('idCliente').populate('idTrabajador');

    const csvWriter = createObjectCsvWriter({
      path: path.join(downloadsDir, '/ventasDeHoy.csv'),
      header: [
        { id: 'id' },
        { id: 'cliente' },
        { id: 'trabajador' },
        { id: 'estado' },
        { id: 'total' },
        { id: 'fecha' },
      ]
    });

    const csvRows = ventasDeHoy.map(venta => ({
      id: venta.codigo,
      cliente: `${venta.idCliente.nombres} ${venta.idCliente.apellidos}`,
      trabajador: `${venta.idTrabajador.nombres} ${venta.idTrabajador.apellidos}`,
      estado: venta.estado,
      total: venta.total,
      fecha: format(new Date(venta.fechaCreacion), 'yyyy-MM-dd'),
    }));

    const csvContent = csvRows.map(row => Object.values(row).join(',')).join('\n');

    const filePath = path.join(downloadsDir, 'ventasDeHoy.csv');
    fs.writeFileSync(filePath, csvContent);

    await storage.bucket(bucketName).upload(filePath, {
      destination: destinationFilename
    });

    res.send('Archivo CSV generado y subido a GCS exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar y subir el archivo CSV');
  }
};

export const generarContratoPDF = async (id) => {
  try {

    const venta = await Venta.findById(id).populate('idCliente').populate('idTrabajador');

    if (!venta) {
      throw new Error('Ingreso no encontrado');
    }

    const detallesVenta = await DetalleVenta.find({ idVenta: venta._id }).populate('idProducto');
    const productosSeleccionadosNombre = detallesVenta.map(detalle => detalle.idProducto?.nombre || 'N/A');
    const productosSeleccionadosPrecio = detallesVenta.map(detalle => detalle.idProducto?.precio || 'N/A');
    const productosSeleccionadosCantidad = detallesVenta.map(detalle => detalle.cantidad?.toString() || 'N/A');
    const productosSeleccionadosTotal = detallesVenta.map(detalle => detalle.total?.toFixed(2) || 'N/A');
    const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');
    const tratamientosSeleccionadosNombre = detallesTratamiento.map(detalle => detalle.idTratamiento?.nombre || 'N/A');
    const tratamientosSeleccionadosPrecio = detallesTratamiento.map(detalle => detalle.idTratamiento.precio?.toFixed(2) || 'N/A');

    const doc = new pdfkit({ size: 'Legal' });

    // Encabezado
    doc.font('Helvetica').fontSize(18).text('Óptica NUEVO MUNDO', { align: 'center' });
    doc.fontSize(10).text('Av. Universitaria Norte Mz L1 Lote 8', { align: 'center' });
    doc.text('A.H. Daniel Alcides Carrión', { align: 'center' });
    doc.text('Los Olivos', { align: 'center' });
    doc.text('Teléfono: 01 6788125 / 994648863', { align: 'center' });
    doc.moveDown(1);

    // Título del contrato
    doc.fontSize(14).text('CONTRATO', { align: 'right' });
    doc.fontSize(12).text(`Número: ${venta.codigo}`, { align: 'right' });
    doc.text(`Fecha: ${new Date(venta.fechaCreacion)?.toLocaleDateString()}`, { align: 'right' });
    doc.text(`Estado: ${venta.estado}`, { align: 'right' });
    doc.moveDown(1);

    // Información del Cliente
    doc.fontSize(12).text('INFORMACIÓN DEL CLIENTE', { underline: true });
    doc.moveDown(0.5);
    doc.text(`DNI: ${venta.idCliente?.dni ? venta.idCliente.dni : 'N/A'}`);
    doc.text(`Nombre: ${venta.idCliente?.nombres ? venta.idCliente.nombres : 'N/A'} ${venta.idCliente?.apellidos ? venta.idCliente.apellidos : 'N/A'}`);
    doc.text(`Teléfono: ${venta.idCliente?.celular ? venta.idCliente.celular : 'N/A'}`);
    doc.text(`Correo: ${venta.idCliente?.correo ? venta.idCliente.correo : 'N/A'}`);
    doc.moveDown(0.5);

    // Información de los ojos
    doc.fontSize(12).text('INFORMACIÓN DE LOS OJOS', { underline: true });
    doc.moveDown(0.5);

    doc.text('Ojo Derecho:');
    doc.moveDown(0.5);
    doc.list(['Esfera: ' + (venta.oDEsfera?.toString() || 'N/A'),
    'Cilindro: ' + (venta.oDCilindro?.toString() || 'N/A'),
    'Eje: ' + (venta.oDEje?.toString() || 'N/A'),
    'A/V Lejos: ' + (venta.oDAvLejos?.toString() || 'N/A'),
    'A/V Cerca: ' + (venta.oDAvCerca?.toString() || 'N/A'),
    'Add.: ' + (venta.oDAdd?.toString() || 'N/A'),
    'Altura: ' + (venta.oDAltura?.toString() || 'N/A'),
    'Curva: ' + (venta.oDCurva?.toString() || 'N/A')
    ], 100, doc.y, { bulletRadius: 2 })

    doc.moveDown(0.5);

    const offsetX = 250; // Ajusta según tu diseño
    doc.text('Ojo Izquierdo:', offsetX, doc.y - 139.54); // Ajusta la posición Y según necesites
    doc.moveDown(0.5);
    doc.list([
      'Esfera: ' + (venta.oIEsfera?.toString() || 'N/A'),
      'Cilindro: ' + (venta.oICilindro?.toString() || 'N/A'),
      'Eje: ' + (venta.oIEje?.toString() || 'N/A'),
      'A/V Lejos: ' + (venta.oIAvLejos?.toString() || 'N/A'),
      'A/V Cerca: ' + (venta.oIAvCerca?.toString() || 'N/A'),
      'Add.: ' + (venta.oIAdd?.toString() || 'N/A'),
      'Altura: ' + (venta.oIAltura?.toString() || 'N/A'),
      'Curva: ' + (venta.oICurva?.toString() || 'N/A')
    ], offsetX + 30, doc.y, { bulletRadius: 2 });

    doc.moveDown(0.5);

    const offsetXDIP = 426; // Ajusta según tu diseño
    doc.text('DIP:', offsetXDIP, doc.y - 139.54); // Ajusta la posición Y según necesites
    doc.moveDown(0.5);
    doc.list([
      'Cerca: ' + (venta.dipCerca?.toString() || 'N/A'),
      'Lejos: ' + (venta.dipLejos?.toString() || 'N/A'),
    ], offsetXDIP + 30, doc.y, { bulletRadius: 2 });

    doc.moveDown(1);

    // Información de los productos
    doc.fontSize(12).text('PRODUCTO(S)', 72, doc.y + 85, { underline: true });
    doc.moveDown(0.5);

    // Lista de productos
    productosSeleccionadosNombre.forEach((nombre, index) => {
      doc.text(`- ${nombre}, precio: S/. ${productosSeleccionadosPrecio[index]}, cantidad: ${productosSeleccionadosCantidad[index]}, total: S/. ${productosSeleccionadosTotal[index]}`);
      doc.moveDown(0.5);
    });

    // LUNAS
    doc.moveDown(1);
    doc.fontSize(12).text('LUNA', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Tipo: ${venta.idTipoLuna?.nombre ? venta.idTipoLuna.nombre : 'N/A'}`);
    doc.text(`Material: ${venta.idMaterialLuna?.material ? venta.idMaterialLuna.material : 'N/A'}`);
    doc.moveDown(0.5);

    // Tratamientos
    doc.moveDown(1);
    doc.fontSize(12).text('TRATAMIENTOS', { underline: true });
    doc.moveDown(0.5);

    // Lista de tratamientos
    let tratamientosLinea = '';
    if (tratamientosSeleccionadosNombre.length > 0) {
      tratamientosSeleccionadosNombre.forEach((nombre, index) => {
        tratamientosLinea += `${nombre} (S/. ${tratamientosSeleccionadosPrecio[index]}), `;
      });
      doc.text(tratamientosLinea.slice(0, -2)); // Remueve la última coma y espacio
    } else {
      doc.text('N/A');
    }

    // Observaciones y montos
    doc.moveDown(1);
    doc.fontSize(12).text('OBSERVACIONES', { underline: true });
    doc.moveDown(0.5);
    doc.text(venta?.observacion || 'N/A');
    doc.moveDown(1);

    doc.fontSize(12).text('MONTOS', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Total: S/. ${venta.total?.toFixed(2)}`);
    doc.text(`A cuenta: S/. ${venta.aCuenta?.toFixed(2)}`);
    doc.text(`Saldo: S/. ${venta.saldo?.toFixed(2)}`);
    doc.moveDown(1);

    // Información del trabajador
    doc.fontSize(12).text('INFORMACIÓN DEL TRABAJADOR', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Vendedor(a): ${venta.idTrabajador?.nombres} ${venta.idTrabajador?.apellidos}`);
    doc.moveDown(2);

    // Pie de página
    doc.fontSize(10).text('Pasados los 30 días, no hay lugar a reclamo.', { align: 'center' });
    doc.text('La lámpara del cuerpo es el ojo; así que, si tu ojo es bueno, todo tu cuerpo estará lleno de luz. Mateo 6:22', { align: 'center' });

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

export const descargarContratoPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findById(id).populate('idCliente');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const pdfBuffer = await generarContratoPDF(id);

    if (!pdfBuffer) {
      return res.status(500).json({ message: 'Error al generar el PDF de la venta' });
    }

    // Preparar la respuesta con el PDF como un Blob
    res.setHeader('Content-Disposition', `attachment; filename="contrato-${venta.codigo}-${venta.idCliente.apellidos}-${venta.estado}.pdf;"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al descargar el PDF de la venta:', error);
    res.status(500).json({ message: 'Error al descargar el PDF de la venta', error });
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
const enviarCorreoCliente = async (correoCliente, estadoVenta, idVenta) => {
  try {

    const venta = await Venta.findById(idVenta).populate('idCliente');
    if (!venta) {
      throw new Error(`Venta con ID ${idVenta} no encontrado`);
    }

    const pdfBuffer = await generarContratoPDF(idVenta);

    // Formatear la fecha de creación
    const fechaCreacion = new Date(venta.fechaCreacion);
    const fechaFormateada = `${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`;
    const horaFormateada = `${fechaCreacion.getHours().toString().padStart(2, '0')}:${fechaCreacion.getMinutes().toString().padStart(2, '0')}`;

    // Configura el mensaje de correo electrónico
    const mailOptions = {
      from: 'rodroaquije062@gmail.com', // Dirección de correo remitente
      to: correoCliente, // Dirección de correo destinatario
      subject: '¡Tu compra está lista para ser recogida en nuestra tienda!',
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
            .logo {
              max-width: 100px;
              height: auto;
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
            <h1>¡Ya puedes recoger tu compra en nuestra tienda!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${venta.idCliente.nombres} ${venta.idCliente.apellidos}</strong>,</p>
            <p>Te informamos que tu compra con código <strong>${venta.codigo}</strong>, realizada el <strong>${fechaFormateada}</strong> a las <strong>${horaFormateada}</strong>, ya se encuentra "<strong>${estadoVenta}</strong>".</p>
            <p>Recuerda que el total de tu compra era de <strong>S/.${venta.total}</strong>, a cuenta dejaste <strong>S/.${venta.aCuenta}</strong> y el saldo pendiente es de <strong>S/.${venta.saldo}</strong>.</p>
            <p>Puedes recoger tu compra en nuestra tienda ubicada en:</p>
            <p><strong>Av. Universitaria Norte Mz L1 Lote 8, A.H. Daniel Alcides Carrión, Los Olivos</strong></p>
            <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos por WhatsApp o llamarnos a nuestros números <strong>01 6788125 - 994648863</strong>.</p>
            <p>Gracias por tu preferencia.</p>
          </div>
          <div class="footer">
            <p>Atentamente,<br>Óptica Nuevo Mundo</p>
          </div>
        </body>
        </html>
        `, attachments: [
        {
          filename: `contrato-${venta.codigo}-${venta.idCliente.apellidos}-${venta.estado}.pdf`,
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

const obtenerProximoCodigoVenta = async () => {
  try {
    // Buscar la última venta en la base de datos
    const ultimaVenta = await Venta.findOne({ codigo: { $regex: /^ONMV-\d{5}$/ } })
      .sort({ codigo: -1 })
      .exec();

    let proximoCodigoNumerico;
    if (!ultimaVenta) {
      // Si no hay ventas en la base de datos, comenzar desde 1
      proximoCodigoNumerico = 1;
    } else {
      // Extraer el número del código de la última venta
      const ultimoCodigoNumerico = parseInt(ultimaVenta.codigo.split('-')[1]);
      console.log(`Último número en el código de venta en la BD: ${ultimoCodigoNumerico}`);

      // Construir el próximo número de código de venta
      proximoCodigoNumerico = ultimoCodigoNumerico + 1;
    }

    // Formatear el próximo código de venta con ceros a la izquierda
    const proximoCodigo = `ONMV-${proximoCodigoNumerico.toString().padStart(5, '0')}`;
    console.log(`Próximo código de venta generado: ${proximoCodigo}`);

    return proximoCodigo;
  } catch (error) {
    throw new Error('Error al obtener el próximo código de venta');
  }
};

export const crearVenta = async (req, res) => {
  try {

    const codigoVenta = await obtenerProximoCodigoVenta();

    const {
      oDEsfera, oDCilindro, oDEje, oDAvLejos, oDAvCerca, oDAdd, oDAltura, oDCurva,
      oIEsfera, oICilindro, oIEje, oIAvLejos, oIAvCerca, oIAdd, oIAltura, oICurva,
      dipLejos, dipCerca, observacion, aCuenta, saldo, total, estado,
      idCliente, idTrabajador, idTipoLuna, idMaterialLuna,
      productosAgregados, tratamientosAgregados
    } = req.body;

    // Verificar el stock antes de realizar la venta
    for (const producto of productosAgregados) {
      const productoExistente = await Producto.findById(producto._id);
      if (!productoExistente) {
        return res.status(404).json({
          message: `El producto con ID ${producto._id} no existe`
        });
      }
      if (productoExistente.stock < producto.cantidad) {
        return res.status(400).json({
          message: `No hay suficiente stock para realizar la venta del producto ${productoExistente.nombre}`
        });
      }
    }

    // Crear la venta
    const venta = new Venta({
      codigo: codigoVenta, oDEsfera, oDCilindro, oDEje, oDAvLejos, oDAvCerca, oDAdd, oDAltura, oDCurva,
      oIEsfera, oICilindro, oIEje, oIAvLejos, oIAvCerca, oIAdd, oIAltura, oICurva,
      dipLejos, dipCerca, observacion, aCuenta, saldo, total, estado,
      idCliente, idTrabajador,
      idTipoLuna: idTipoLuna ? idTipoLuna : null,
      idMaterialLuna: idMaterialLuna ? idMaterialLuna : null
    });

    const savedVenta = await venta.save();

    // Actualizar el stock después de la venta
    for (const producto of productosAgregados) {
      const productoExistente = await Producto.findById(producto._id);
      productoExistente.stock -= producto.cantidad;
      await productoExistente.save();
    }

    // Crear los detalles de venta
    const detalleVentasPromises = productosAgregados.map(producto => {
      const detalleVenta = new DetalleVenta({
        cantidad: producto.cantidad,
        descuento: producto.descuento,
        total: producto.total,
        idVenta: savedVenta._id,
        idProducto: producto._id
      });
      return detalleVenta.save();
    });

    // Crear los detalles de tratamiento
    const detalleTratamientosPromises = tratamientosAgregados.map(tratamiento => {
      const detalleTratamiento = new DetalleTratamiento({
        idTratamiento: tratamiento._id,
        idVenta: savedVenta._id
      });
      return detalleTratamiento.save();
    });

    // Ejecutar todas las promesas
    await Promise.all([...detalleVentasPromises, ...detalleTratamientosPromises]);

    res.status(201).json({ message: 'Venta creada con éxito', venta: savedVenta });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
};

export const obtenerVentas = async (req, res) => {
  try {
    // Obtener todas las ventas
    const ventas = await Venta.find().populate('idCliente').populate('idTrabajador');

    // Para cada venta, buscar sus detalles de venta correspondientes
    const ventasConDetalles = await Promise.all(ventas.map(async (venta) => {
      const detallesVenta = await DetalleVenta.find({ idVenta: venta._id }).populate('idProducto');
      const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');
      return {
        venta,
        detallesVenta,
        detallesTratamiento
      };
    }));

    res.status(200).json({ ventasConDetalles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};

export const obtenerVenta = async (req, res) => {
  try {
    // Obtener el ID de la venta desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar la venta específica por su ID
    const venta = await Venta.findById(id).populate('idCliente').populate('idTrabajador');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const detallesVenta = await DetalleVenta.find({ idVenta: venta._id }).populate('idProducto');
    const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');

    // Verificar si la venta está en estado "Cambio Solicitado" o "Reembolsada"
    if (venta.estado === 'Cambio Solicitado' || venta.estado === 'Reembolsada') {
      const devolucion = await Devolucion.findOne({ idVenta: venta._id }).populate('idTrabajador');
      if (devolucion) {
        const detallesDevolucion = await DetalleDevolucion.find({ idDevolucion: devolucion._id }).populate('idProducto');
        return res.status(200).json({
          venta,
          detallesVenta,
          detallesTratamiento,
          devolucion,
          detallesDevolucion
        });
      }
    }

    // Obtener el correo electrónico del cliente
    const cliente = await Cliente.findById(venta.idCliente);
    const correoCliente = cliente ? cliente.correo : null;

    res.status(200).json({
      venta,
      correoCliente,
      detallesVenta,
      detallesTratamiento
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta', error });
  }
};

export const actualizarVenta = async (req, res) => {
  try {
    const ventaId = req.params.id; // Obtener el ID de la venta de los parámetros de la solicitud
    const ventaActualizada = req.body; // Obtener los datos actualizados de la venta del cuerpo de la solicitud

    const ventaExistente = await Venta.findById(ventaId);

    // Verificar si la venta existe
    if (!ventaExistente) {
      return res.status(404).json({ message: `La venta con código ${ventaExistente.codigo} no existe` });
    }

    // Actualizar los datos de la venta
    await Venta.findByIdAndUpdate(ventaId, ventaActualizada, { new: true });

    res.status(200).json({ message: `Venta con con código ${ventaExistente.codigo} actualizada con éxito`, venta: ventaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta', error });
  }
};

export const actualizarEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const ventaExistente = await Venta.findById(id).populate('idCliente');

    if (!ventaExistente) {
      return res.status(404).json({ message: `La venta con ID ${id} no existe` });
    }

    // Si el estado cambia a "En Tienda", envía un correo electrónico al cliente
    if (estado === 'En Tienda' && ventaExistente.estado !== 'En Tienda') {
      const correoCliente = ventaExistente.idCliente.correo;
      if (!correoCliente) {
        return res.status(400).json({ message: `El cliente de la venta con ID ${id} no tiene un correo electrónico válido` });
      }

      await enviarCorreoCliente(correoCliente, estado, ventaExistente);
    }

    // Actualizar el estado de la venta en la base de datos
    const ventaActualizada = await Venta.findByIdAndUpdate(id, { estado }, { new: true });

    if (!ventaActualizada) {
      return res.status(404).json({ message: `La venta con ID ${id} no existe` });
    }

    res.status(200).json({ message: `Estado de la venta actualizado correctamente`, venta: ventaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la venta', error });
  }
};

export const obtenerVentasMesActual = async (req, res) => {
  try {
    const ventas = await Venta.find().populate('idCliente').populate('idTrabajador');
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();

    const ventasMesActual = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaCreacion);
      return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === fechaActual.getFullYear();
    });

    res.status(200).json({ ventas: ventasMesActual });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};