import DetalleTratamiento from "../models/detalleTratamiento.js";
import DetalleVenta from "../models/detalleVenta.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.js";
import Cliente from "../models/cliente.js"
import Devolucion from "../models/devolucion.js";
import DetalleDevolucion from "../models/detalleDevolucion.js";
import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import path from 'path';
import pdfkit from 'pdfkit';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const descargarContratoPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findById(id).populate('idCliente').populate('idTrabajador');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const detallesVenta = await DetalleVenta.find({ idVenta: venta._id }).populate('idProducto');
    const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');

    const doc = new pdfkit();

    const fileName = `contrato-${venta.codigo}-${venta.idCliente.apellidos}.pdf`;
    const filePath = path.join(process.cwd(), 'temp', fileName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    doc.font('Helvetica').fontSize(12);

    // Encabezado
    doc.fontSize(18).text('Contrato de Venta', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Código: ${venta.codigo}`, { align: 'right' });
    doc.moveDown(2);

    // Información del Cliente
    doc.fontSize(12).text(`CLIENTE`);
    doc.moveDown(0.5);
    doc.text(`DNI: ${venta.idCliente.dni}`);
    doc.text(`Nombres: ${venta.idCliente.nombres}`);
    doc.text(`Apellidos: ${venta.idCliente.apellidos}`);
    doc.text(`Celular: ${venta.idCliente.celular}`);
    doc.text(`Direccion: ${venta.idCliente.direccion}`);
    doc.text(`Correo Electronico: ${venta.idCliente.correo}`);
    doc.moveDown(1);

    // Información de los Ojos
    doc.text(`Ojo Derecho`);
    doc.text(`Esfera: ${venta.oDEsfera}`);
    doc.text(`Cilindro: ${venta.oDCilindro}`);
    doc.text(`Eje: ${venta.oDEje}`);
    doc.text(`A/V Lejos: ${venta.oDAvLejos}`);
    doc.text(`A/V Cerca: ${venta.oDAvCerca}`);
    doc.text(`Add: ${venta.oDAdd}`);
    doc.text(`Altura: ${venta.oDAltura}`);
    doc.text(`Curva: ${venta.oDCurva}`);
    doc.text(`DIP Lejos: ${venta.dipLejos}`);
    doc.text(`DIP Cerca: ${venta.dipCerca}`);
    doc.moveDown(1);

    doc.text(`Ojo Izquierdo`);
    doc.text(`Esfera: ${venta.oIEsfera}`);
    doc.text(`Cilindro: ${venta.oICilindro}`);
    doc.text(`Eje: ${venta.oIEje}`);
    doc.text(`A/V Lejos: ${venta.oIAvLejos}`);
    doc.text(`A/V Cerca: ${venta.oIAvCerca}`);
    doc.text(`Add: ${venta.oIAdd}`);
    doc.text(`Altura: ${venta.oIAltura}`);
    doc.text(`Curva: ${venta.oICurva}`);
    doc.moveDown(1);

    // Material de Luna
    doc.text(`Material Luna: ${venta.idMaterialLuna}`);
    doc.moveDown(1);

    // Detalles de Venta
    doc.fontSize(14).text('Detalles de Venta', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    detallesVenta.forEach((detalle) => {
      doc.text(`Producto: ${detalle.idProducto.nombre}`);
      doc.text(`Código: ${detalle.idProducto.codigo}`);
      doc.text(`Precio: ${detalle.idProducto.precio}`);
      doc.text(`Stock: ${detalle.idProducto.stock}`);
      doc.text(`Cantidad: ${detalle.cantidad}`);
      doc.text(`Total: ${detalle.total}`);
      doc.moveDown();
    });

    // Tratamientos
    doc.fontSize(14).text('Tratamientos', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    detallesTratamiento.forEach((detalle) => {
      doc.text(`Tratamiento: ${detalle.idTratamiento.nombre}`);
      doc.moveDown();
    });

    // Observaciones
    doc.fontSize(14).text('Observaciones', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(venta.observacion);
    doc.moveDown(2);

    // Información del Trabajador
    doc.fontSize(12).text(`Vendedor(a): ${venta.idTrabajador.nombre}`);
    doc.moveDown(2);

    // Montos
    doc.fontSize(12).text(`TOTAL (S/.): ${venta.total}`);
    doc.text(`A CUENTA (S/.): ${venta.aCuenta}`);
    doc.text(`SALDO (S/.): ${venta.saldo}`);
    doc.moveDown(2);

    // Finalización del documento
    doc.end();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    stream.on('finish', () => {
      res.download(filePath, fileName, async (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
        } else {
          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.error('Error deleting the file:', err);
          }
        }
      });
    });
  } catch (err) {
    console.error('Error generating the PDF:', err);
    res.status(500).json({ message: 'Error al generar el PDF' });
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
const enviarCorreoCliente = async (correoCliente, estadoVenta, venta) => {
  try {

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
            <p><strong>Mz, Av. Universitaria 8, Los Olivos 15302</strong></p>
            <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos por WhatsApp o llamarnos a nuestro número <strong>923829182</strong>.</p>
            <p>Gracias por tu preferencia.</p>
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

const obtenerProximoCodigoVenta = async () => {
  try {
    // Buscar la última venta en la base de datos
    const ultimaVenta = await Venta.findOne().sort({ codigo: -1 }).exec();

    // Si no hay ventas en la base de datos, comenzar desde 1
    if (!ultimaVenta) {
      return 'ONMV-1';
    }

    // Extraer el número del código de la última venta
    const ultimoCodigoNumerico = parseInt(ultimaVenta.codigo.split('-')[1]);

    // Construir el próximo código de venta
    const proximoCodigoNumerico = ultimoCodigoNumerico + 1;
    return `ONMV-${proximoCodigoNumerico}`;
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