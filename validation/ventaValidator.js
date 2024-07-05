import { check, validationResult } from 'express-validator';

const ventaValidator = () => {
    return [
        // Campos del ojo derecho (derecho)
        check('oDEsfera').exists().withMessage('La esfera derecha es requerida').isNumeric().withMessage('La esfera debe ser numérica'),
        check('oDCilindro').exists().withMessage('El cilindro derecho es requerido').isNumeric().withMessage('El cilindro debe ser numérico'),
        check('oDEje').exists().withMessage('El eje derecho es requerido').isNumeric().withMessage('El eje debe ser numérico'),
        check('oDAvLejos').exists().withMessage('La agudeza visual lejos derecha es requerida').isNumeric().withMessage('La agudeza visual lejos debe ser numérica'),
        check('oDAvCerca').exists().withMessage('La agudeza visual cerca derecha es requerida').isNumeric().withMessage('La agudeza visual cerca debe ser numérica'),
        check('oDAdd').exists().withMessage('El add derecho es requerido').isNumeric().withMessage('El add debe ser numérico'),
        check('oDAltura').exists().withMessage('La altura derecha es requerida').isNumeric().withMessage('La altura debe ser numérica'),
        check('oDCurva').exists().withMessage('La curva derecha es requerida').isNumeric().withMessage('La curva debe ser numérica'),

        // Campos del ojo izquierdo (izquierdo)
        check('oIEsfera').exists().withMessage('La esfera izquierda es requerida').isNumeric().withMessage('La esfera debe ser numérica'),
        check('oICilindro').exists().withMessage('El cilindro izquierdo es requerido').isNumeric().withMessage('El cilindro debe ser numérico'),
        check('oIEje').exists().withMessage('El eje izquierdo es requerido').isNumeric().withMessage('El eje debe ser numérico'),
        check('oIAvLejos').exists().withMessage('La agudeza visual lejos izquierda es requerida').isNumeric().withMessage('La agudeza visual lejos debe ser numérica'),
        check('oIAvCerca').exists().withMessage('La agudeza visual cerca izquierda es requerida').isNumeric().withMessage('La agudeza visual cerca debe ser numérica'),
        check('oIAdd').exists().withMessage('El add izquierdo es requerido').isNumeric().withMessage('El add debe ser numérico'),
        check('oIAltura').exists().withMessage('La altura izquierda es requerida').isNumeric().withMessage('La altura debe ser numérica'),
        check('oICurva').exists().withMessage('La curva izquierda es requerida').isNumeric().withMessage('La curva debe ser numérica'),

        // Otros campos de la venta
        check('dipLejos').exists().withMessage('El dip de lejos es requerido').isNumeric().withMessage('El dip de lejos debe ser numérico'),
        check('dipCerca').exists().withMessage('El dip de cerca es requerido').isNumeric().withMessage('El dip de cerca debe ser numérico'),

        // Validación personalizada para campos opcionales con formato específico
        check('observacion').optional().isString().withMessage('La observación debe ser texto'),

        // IDs de referencias
        check('idCliente').exists().withMessage('El ID del cliente es requerido').isMongoId().withMessage('ID de cliente no válido'),
        check('idTrabajador').exists().withMessage('El ID del trabajador es requerido').isMongoId().withMessage('ID de trabajador no válido'),

        // Opcionales
        check('idTipoLuna').optional().isMongoId().withMessage('ID de tipo de luna no válido'),
        check('idMaterialLuna').optional().isMongoId().withMessage('ID de material de luna no válido'),

        // Productos y tratamientos
        check('productosAgregados').isArray({ min: 1 }).withMessage('Debe haber al menos un producto agregado'),
        check('tratamientosAgregados').isArray({ min: 1 }).withMessage('Debe haber al menos un tratamiento agregado'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

export default ventaValidator;