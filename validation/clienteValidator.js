import { check, validationResult } from "express-validator";
import Cliente from "../models/cliente.js";

const clienteValidator = () => {
    return [
        check('dni')
            .notEmpty().withMessage('El DNI del cliente es obligatorio')
            .isNumeric().withMessage('El DNI solo debe contener números')
            .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener exactamente 8 dígitos')
            .custom(value => {
                if (/\s/.test(value)) {
                    throw new Error('El DNI no debe contener espacios en blanco');
                }
                return true;
            }),

        check('nombres')
            .notEmpty().withMessage('El primer nombre del cliente es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del cliente debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del cliente debe empezar con mayúscula seguida de minúsculas, y si tiene otros nombres deben comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El apellido del cliente no debe tener espacios al inicio ni al final'),

        check('apellidos')
            .notEmpty().withMessage('El primer apellido del cliente es obligatorio')
            .isLength({ min: 4 }).withMessage('El primer apellido del cliente debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)?$/)
            .withMessage('El apellido del cliente debe empezar con mayúscula seguida de minúsculas, y si tiene un segundo apellido que también que comience con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El apellido del cliente no debe tener espacios al inicio ni al final'),

        check('direccion')
            .notEmpty().withMessage('La dirección del cliente es obligatoria')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('La dirección no debe tener espacios al inicio ni al final'),

        check('celular')
            .notEmpty().withMessage('El celular del proveedor es obligatorio')
            .isMobilePhone('es-PE').withMessage('El formato del celular no es válido')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El celular no debe tener espacios al inicio ni al final'),

        check('correo')
            .notEmpty().withMessage('El email del cliente es obligatorio')
            .isEmail().withMessage('El formato del email no es válido')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El correo no debe tener espacios al inicio ni al final'),

        // Validación de DNI único (case-sensitive)
        check('dni').custom(async (value, { req }) => {
            let cliente = await Cliente.findOne({ dni: value }).collation({ locale: 'es', strength: 2 });

            if (cliente && (req.params.id !== cliente._id.toString())) {
                throw new Error('El DNI del cliente ya está registrado');
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const checkError = errors.array().map(error => error.msg);
                res.status(400).json({
                    errors: checkError
                });
                return;
            }
            next();
        }
    ];
};

export default clienteValidator;
