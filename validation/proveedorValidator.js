import { check, validationResult } from "express-validator";
import Proveedor from "../models/proveedor.js";

const proveedorValidator = () => {
    return [
        check('ruc')
            .notEmpty().withMessage('El RUC del proveedor es obligatorio')
            .isNumeric().withMessage('El RUC solo debe contener números')
            .isLength({ min: 11, max: 11 }).withMessage('El RUC debe tener exactamente 11 dígitos')
            .custom(value => {
                if (/\s/.test(value)) {
                    throw new Error('El RUC no debe contener espacios en blanco');
                }
                return true;
            }),

        check('nombre')
            .notEmpty().withMessage('El nombre del proveedor es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del proveedor debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del proveedor debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del proveedor no debe tener espacios al inicio ni al final'),

        check('nombreContacto')
            .notEmpty().withMessage('El nombre del contacto es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del contacto debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del contacto debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del contacto no debe tener espacios al inicio ni al final'),

        check('apellidoContacto')
            .notEmpty().withMessage('El apellido del contacto es obligatorio')
            .isLength({ min: 4 }).withMessage('El apellido del contacto debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El apellido del contacto debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El apellido del contacto no debe tener espacios al inicio ni al final'),

        check('telefono')
            .notEmpty().withMessage('El teléfono del proveedor es obligatorio')
            .isMobilePhone('es-PE').withMessage('El formato del teléfono no es válido'),

        check('direccion')
            .notEmpty().withMessage('La dirección del proveedor es obligatoria'),

        check('correo')
            .notEmpty().withMessage('El email del proveedor es obligatorio')
            .isEmail().withMessage('El formato del email no es válido'),

        // Validación de RUC único (case-sensitive)
        check('ruc').custom(async (value, { req }) => {
            let proveedor = await Proveedor.findOne({ ruc: value }).collation({ locale: 'es', strength: 2 });

            if (proveedor && (req.params.id !== proveedor._id.toString())) {
                throw new Error('El RUC del proveedor ya está registrado');
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const checkError = errors.array().map(error => error.msg);
                res.status(400).json({
                    msg: checkError
                });
                return;
            }
            next();
        }
    ];
};

export default proveedorValidator;