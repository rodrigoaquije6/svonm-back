import { check, validationResult } from 'express-validator';

const ingresoValidator = () => {
    return [
        check('observacion')
            .notEmpty().withMessage('La observación del ingreso es obligatoria')
            .custom(value => !(/^\s|\s$/.test(value)))
            .withMessage('La observación no debe tener espacios en blanco al inicio o al final'),

        check('descuento')
            .notEmpty().withMessage('El descuento es obligatorio')
            .isFloat({ min: 0 }).withMessage('El descuento debe ser un número mayor o igual a 0%')
            .custom(value => {
                if (value >= 100) {
                    throw new Error('El descuento no puede ser mayor que 100%');
                }
                return true;
            }).withMessage('El descuento no puede ser mayor que 100%'),

        check('impuesto')
            .notEmpty().withMessage('El impuesto es obligatorio')
            .isFloat({ min: 0 }).withMessage('El impuesto debe ser un número mayor o igual a 0%')
            .custom(value => {
                if (value > 100) {
                    throw new Error('El impuesto no puede ser mayor que 100%');
                }
                return true;
            }).withMessage('El impuesto no puede ser mayor que 100%'),

        check('subtotal')
            .notEmpty().withMessage('El subtotal es obligatorio')
            .isFloat({ min: 0 }).withMessage('El subtotal no debe ser negativo'),

        check('total')
            .notEmpty().withMessage('El total es obligatorio')
            .isFloat({ min: 0 }).withMessage('El total no debe ser negativo'),

        check('fechaEntregaEstimada')
            .notEmpty().withMessage('La fecha de entrega estimada es obligatoria')
            .isISO8601().withMessage('La fecha de entrega estimada debe ser una fecha válida'),

        check('idProveedor')
            .notEmpty().withMessage('El ID del proveedor es obligatorio')
            .isMongoId().withMessage('El ID del proveedor debe ser un ID válido'),

        check('idTrabajador')
            .notEmpty().withMessage('El ID del trabajador es obligatorio')
            .isMongoId().withMessage('El ID del trabajador debe ser un ID válido'),

        check('productosAgregados')
            .notEmpty().withMessage('Debe agregar al menos un producto')
            .isArray({ min: 1 }).withMessage('Debe agregar al menos un producto válido'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

export default ingresoValidator;