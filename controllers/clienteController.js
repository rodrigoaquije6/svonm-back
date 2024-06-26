import Cliente from "../models/cliente.js";
import Venta from "../models/venta.js";
import DetalleTratamiento from "../models/detalleTratamiento.js"
import ExcelJS from 'exceljs';

export const generarHistorialClienteExcel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID del cliente no proporcionado' });
        }

        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const ventas = await Venta.find({ idCliente: id, estado: 'Finalizada' }).sort({ fecha: 1 });
        if (ventas.length === 0) {
            return res.status(404).json({ message: 'El cliente aun no ha realizado compras o su compra aún no ha concluido' });
        }

        let tieneVentasConDatosNecesarios = false;
        for (const venta of ventas) {
            if (
                venta.oDEsfera && venta.oDEje && venta.oDCilindro &&
                venta.oDAvLejos && venta.oDAvCerca && venta.oDAdd &&
                venta.oDAltura && venta.oDCurva && venta.oIEsfera &&
                venta.oIEje && venta.oICilindro && venta.oIAvLejos &&
                venta.oIAvCerca && venta.oIAdd && venta.oIAltura &&
                venta.oICurva && venta.dipLejos && venta.dipCerca &&
                venta.idTipoLuna && venta.idMaterialLuna
            ) {
                tieneVentasConDatosNecesarios = true;
                break;
            }
        }

        if (!tieneVentasConDatosNecesarios) {
            return res.status(404).json({ message: 'El cliente no ha realizado compras con el fin de tratar su vista ' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Historial del Cliente');

        // Título
        worksheet.addRow([]);
        worksheet.addRow(['HISTORIAL DE CLIENTE']).font = { bold: true, size: 20 };
        worksheet.addRow([]);

        // Información del cliente
        worksheet.addRow(['INFORMACIÓN DEL CLIENTE']).font = { bold: true, size: 11, underline: true };
        worksheet.addRow(['Nombre:', cliente.nombres]);
        worksheet.addRow(['Apellidos:', cliente.apellidos]);
        worksheet.addRow(['Correo:', cliente.correo]);
        worksheet.addRow([]);

        // Ajustar el ancho
        worksheet.getColumn('A').width = 18;
        worksheet.getColumn('B').width = 11;
        worksheet.getColumn('E').width = 11;
        worksheet.getColumn('F').width = 11;
        worksheet.getColumn('K').width = 11;

        // Estilos para bordes y centrado
        const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const centerAlignment = { vertical: 'middle', horizontal: 'center' };
        const fillColor = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };



        for (const venta of ventas) {
            if (
                !venta.oDEsfera || !venta.oDEje || !venta.oDCilindro ||
                !venta.oDAvLejos || !venta.oDAvCerca || !venta.oDAdd ||
                !venta.oDAltura || !venta.oDCurva || !venta.oIEsfera ||
                !venta.oIEje || !venta.oICilindro || !venta.oIAvLejos ||
                !venta.oIAvCerca || !venta.oIAdd || !venta.oIAltura ||
                !venta.oICurva || !venta.dipLejos || !venta.dipCerca ||
                !venta.idTipoLuna || !venta.idMaterialLuna
            ) {
                continue;
            }

            const tratamientos = await DetalleTratamiento.find({ idVenta: venta._id }).populate('idTratamiento');
            const tratamientosNombres = tratamientos.map(t => t.idTratamiento.nombre).join(',  ');

            // Información de la venta
            worksheet.addRow(['INFORMACIÓN DE LA VENTA']).font = { bold: true, size: 11, underline: true };
            worksheet.addRow(['Código de Venta:', venta.codigo]);
            worksheet.addRow(['Observación:', venta.observacion]);
            worksheet.addRow(['Fecha:', venta.fechaCreacion]).alignment = { horizontal: 'left' };
            worksheet.addRow([]);

            // Carácteristicas de ojos del cliente
            const rowOjos = ['Esfera', 'Eje', 'Cilindro', 'A/V Lejos', 'A/V Cerca', 'Add.', 'Altura', 'Curva', '', 'Distancia', 'DIP', '', 'TRATAMIENTOS'];
            rowOjos.splice(0, 0, 'Ojo');
            const caracteristicasRow = worksheet.addRow(rowOjos);
            caracteristicasRow.eachCell(cell => {
                cell.alignment = centerAlignment;
                cell.border = borderStyle;
                cell.fill = fillColor;
            });

            const rowJ14 = worksheet.getRow(worksheet.rowCount).getCell('J');
            const rowM14 = worksheet.getRow(worksheet.rowCount).getCell('M');
            const rowN14 = worksheet.getRow(worksheet.rowCount).getCell('N');

            rowJ14.border = { left: { style: 'thin' }, right: { style: 'thin' } };
            rowJ14.fill = null;
            rowM14.border = {};
            rowM14.fill = null;
            rowN14.border = {};
            rowN14.fill = null;
            rowN14.alignment = { vertical: 'middle', horizontal: 'left' };

            const tratamientosRow = worksheet.lastRow;
            const tratamientosCell = tratamientosRow.getCell('N');
            tratamientosCell.font = { bold: true, size: 11, underline: true };

            const ojoDerechoRow = worksheet.addRow([
                'Derecho',
                venta.oDEsfera, venta.oDEje, venta.oDCilindro, venta.oDAvLejos, venta.oDAvCerca, venta.oDAdd, venta.oDAltura, venta.oDCurva, '', 'Lejos', venta.dipLejos, '', tratamientosNombres
            ]);
            ojoDerechoRow.eachCell((cell) => {
                cell.alignment = centerAlignment;
                cell.border = borderStyle;
            });

            const rowJ15 = worksheet.getRow(worksheet.rowCount).getCell('J');
            const rowM15 = worksheet.getRow(worksheet.rowCount).getCell('M');
            const rowN15 = worksheet.getRow(worksheet.rowCount).getCell('N');

            rowJ15.border = { left: { style: 'thin' }, right: { style: 'thin' } };
            rowM15.border = {};
            rowN15.border = {};
            rowN15.alignment = { vertical: 'middle', horizontal: 'left' };

            const ojoIzquierdoRow = worksheet.addRow([
                'Izquierdo',
                venta.oIEsfera, venta.oIEje, venta.oICilindro, venta.oIAvLejos, venta.oIAvCerca, venta.oIAdd, venta.oIAltura, venta.oICurva, '', 'Cerca', venta.dipCerca
            ]);
            ojoIzquierdoRow.eachCell((cell) => {
                cell.alignment = centerAlignment;
                cell.border = borderStyle;
            });

            const rowJ16 = worksheet.getRow(worksheet.rowCount).getCell('J');
            const rowM16 = worksheet.getRow(worksheet.rowCount).getCell('M');

            rowJ16.border = { left: { style: 'thin' }, right: { style: 'thin' } };
            rowM16.border = {};

            worksheet.addRow([]);
            worksheet.addRow([]);

        }

        // Guardar el archivo en un buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Enviar el archivo al cliente
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=historial_cliente_${cliente.apellidos}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error('Error al generar el historial del cliente:', error);
        res.status(500).json({ message: 'Error al generar el historial del cliente' });
    }
};

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