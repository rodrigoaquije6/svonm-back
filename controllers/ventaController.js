import DetalleTratamiento from "../models/detalleTratamiento.js";
import DetalleVenta from "../models/detalleVenta.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.js";
import Cliente from "../models/cliente.js"
import Devolucion from "../models/devolucion.js";
import DetalleDevolucion from "../models/detalleDevolucion.js";
import Tratamiento from "../models/tratamiento.js";
import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import path from 'path';
import pdfkit from 'pdfkit';
import puppeteer from 'puppeteer';
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
    const todosTratamientos = await Tratamiento.find();

    const doc = new pdfkit({ size: 'A4' });

    const fileName = `contrato-${venta.codigo}-${venta.idCliente.apellidos}.pdf`;
    const filePath = path.join(process.cwd(), 'temp', fileName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Encabezado
    doc.font('Helvetica').fontSize(18).text('Óptica NUEVO MUNDO', { align: 'center' });
    doc.fontSize(10).text('Av. Universitaria Norte Mz L1 Lote 8', { align: 'center' });
    doc.text('A.H. Daniel Alcides Carrión', { align: 'center' });
    doc.text('Los Olivos', { align: 'center' });
    doc.text('Teléfono: 01 6788125 / 994648863', { align: 'center' });
    doc.moveDown(1);

    // Título del contrato
    doc.fontSize(14).text('CONTRATO', { align: 'center' });
    doc.fontSize(12).text(`Número: ${venta.codigo}`, { align: 'right' });
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(1);

    // Información de los ojos
    doc.fontSize(12).text('INFORMACIÓN DE LOS OJOS', { underline: true });
    doc.moveDown(0.5);

    const column1X = 50;
    const column2X = 300;
    const colWidth = 100;

    // Tabla de información de los ojos
    doc.text('Ojo', column1X, doc.y);
    doc.text('Esfera', column1X + colWidth, doc.y);
    doc.text('Cilindro', column1X + colWidth * 2, doc.y);
    doc.text('Eje', column1X + colWidth * 3, doc.y);
    doc.text('A/V Lejos', column1X + colWidth * 4, doc.y);
    doc.text('A/V Cerca', column1X + colWidth * 5, doc.y);
    doc.text('Add', column2X, doc.y);
    doc.text('Altura', column2X + colWidth, doc.y);
    doc.text('Curva', column2X + colWidth * 2, doc.y);
    doc.moveDown(0.5);

    // Datos de los ojos
    const ojoDerechoY = doc.y;
    doc.text('Derecho', column1X, ojoDerechoY);
    doc.text(venta.oDEsfera.toString(), column1X + colWidth, ojoDerechoY);
    doc.text(venta.oDCilindro.toString(), column1X + colWidth * 2, ojoDerechoY);
    doc.text(venta.oDEje.toString(), column1X + colWidth * 3, ojoDerechoY);
    doc.text(venta.oDAvLejos.toString(), column1X + colWidth * 4, ojoDerechoY);
    doc.text(venta.oDAvCerca.toString(), column1X + colWidth * 5, ojoDerechoY);
    doc.text(venta.oDAdd.toString(), column2X, ojoDerechoY);
    doc.text(venta.oDAltura.toString(), column2X + colWidth, ojoDerechoY);
    doc.text(venta.oDCurva.toString(), column2X + colWidth * 2, ojoDerechoY);

    const ojoIzquierdoY = doc.y;
    doc.text('Izquierdo', column1X, ojoIzquierdoY);
    doc.text(venta.oIEsfera.toString(), column1X + colWidth, ojoIzquierdoY);
    doc.text(venta.oICilindro.toString(), column1X + colWidth * 2, ojoIzquierdoY);
    doc.text(venta.oIEje.toString(), column1X + colWidth * 3, ojoIzquierdoY);
    doc.text(venta.oIAvLejos.toString(), column1X + colWidth * 4, ojoIzquierdoY);
    doc.text(venta.oIAvCerca.toString(), column1X + colWidth * 5, ojoIzquierdoY);
    doc.text(venta.oIAdd.toString(), column2X, ojoIzquierdoY);
    doc.text(venta.oIAltura.toString(), column2X + colWidth, ojoIzquierdoY);
    doc.text(venta.oICurva.toString(), column2X + colWidth * 2, ojoIzquierdoY);
    doc.moveDown(1);

    // Tratamientos
    doc.fontSize(12).text('TRATAMIENTOS', { underline: true });
    doc.moveDown(0.5);

    // Lista de tratamientos
    const tratamientos = todosTratamientos.map(tratamiento => tratamiento.nombre);
    doc.list(tratamientos, { bulletRadius: 2 });

    // Observaciones y montos
    doc.moveDown(1);
    doc.fontSize(12).text('OBSERVACIONES', { underline: true });
    doc.moveDown(0.5);
    doc.text(venta.observacion || 'N/A');
    doc.moveDown(1);

    doc.fontSize(12).text('MONTOS', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Total: S/. ${venta.total.toFixed(2)}`);
    doc.text(`A cuenta: S/. ${venta.aCuenta.toFixed(2)}`);
    doc.text(`Saldo: S/. ${venta.saldo.toFixed(2)}`);
    doc.moveDown(1);

    // Información del trabajador
    doc.fontSize(12).text('INFORMACIÓN DEL TRABAJADOR', { underline: true });
    doc.moveDown(0.5);
    doc.text(`Vendedor(a): ${venta.idTrabajador.nombre}`);
    doc.moveDown(2);

    // Pie de página
    doc.fontSize(10).text('Pasados los 30 días, no hay lugar a reclamo.', { align: 'center' });
    doc.text('La lámpara del cuerpo es el ojo; así que, si tu ojo es bueno, todo el');

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, fileName, async (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).json({ message: 'Error al descargar el archivo PDF' });
        } else {
          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        }
      });
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
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
            <p><strong>Av. Universitaria Norte Mz L1 Lote 8, A.H. Daniel Alcides Carrión, Los Olivos</strong></p>
            <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos por WhatsApp o llamarnos a nuestros números <strong>01 6788125 - 994648863</strong>.</p>
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