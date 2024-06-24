import DetalleTratamiento from "../models/detalleTratamiento.js";
import DetalleVenta from "../models/detalleVenta.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.js";
import Cliente from "../models/cliente.js"
import nodemailer from 'nodemailer';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';

const generarContratoPDF = async (venta, detallesVenta, detallesTratamiento) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fechaCreacion = new Date(venta.fechaCreacion);
    const fechaFormateada = `${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`;

    let yPosition = 650;

    const textoEstatico = `
      ¡Contrato Digital de Venta!

      Código de Venta: ${venta.codigo}
      Cliente: ${venta.idCliente.nombres} ${venta.idCliente.apellidos}
      Fecha de Creación: ${fechaFormateada}

      Detalles de la Venta:
      - Total: S/. ${venta.total}
      - A Cuenta: S/. ${venta.aCuenta}
      - Saldo: S/. ${venta.saldo}

      Estado: ${venta.estado}
    `;

    page.drawText(textoEstatico, {
      x: 50,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 180;

    page.drawText('Productos:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    for (const detalle of detallesVenta) {
      const productoInfo = `
        - Producto: ${detalle.idProducto.nombre}
        - Cantidad: ${detalle.cantidad}
        - Total: S/. ${detalle.total}
      `;

      page.drawText(productoInfo, {
        x: 50,
        y: yPosition,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= 40;
    }

    page.drawText('Tratamientos:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    for (const tratamiento of detallesTratamiento) {
      const tratamientoInfo = `
        - Tratamiento: ${tratamiento.idTratamiento.nombre}
      `;

      page.drawText(tratamientoInfo, {
        x: 50,
        y: yPosition,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error al generar el contrato PDF', error);
    throw error;
  }
};

export const descargarContratoPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Venta.findById(id).populate('idCliente').populate('idTrabajador');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const detallesVenta = await DetalleVenta.find({ idVenta: venta._id }).populate('idProducto');
    const detallesTratamiento = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');

    const pdfBytes = await generarContratoPDF(venta, detallesVenta, detallesTratamiento);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${venta.codigo}_contrato.pdf`);

    res.send(pdfBytes);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el contrato PDF', error });
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