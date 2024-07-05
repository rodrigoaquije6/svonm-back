import { check, validationResult } from "express-validator";
import Trabajador from "../models/user.model.js";

const validationTrabajador = () => {
    return [
        check('user_dni')
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
            .notEmpty().withMessage('El primer nombre del trabajador es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del trabajador debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del trabajador debe empezar con mayúscula seguida de minúsculas, y si tiene otros nombres deben comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El apellido del trabajador no debe tener espacios al inicio ni al final'),

        check('apellidos')
            .notEmpty().withMessage('El primer apellido del trabajador es obligatorio')
            .isLength({ min: 4 }).withMessage('El primer apellido del trabajador debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)?$/)
            .withMessage('El apellido del trabajador debe empezar con mayúscula seguida de minúsculas, y si tiene un segundo apellido que también que comience con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El apellido del trabajador no debe tener espacios al inicio ni al final'),

        check('fecha_nac')
            .notEmpty().withMessage('La fecha de nacimiento del trabajador es obligatoria')
            .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Formato de fecha inválido. Debe ser YYYY-MM-DD')
            .custom(value => {
                // Validar el formato YYYY-MM-DD específicamente
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return false;
                }
                const parts = value.split('-');
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const day = parseInt(parts[2], 10);

                // Validar el rango de meses y días
                if (month < 1 || month > 12) {
                    return false;
                }
                if (day < 1 || day > 31) {
                    return false;
                }

                // Validar febrero y los años bisiestos
                if (month === 2) {
                    // Año bisiesto si es divisible por 4, pero no por 100, a menos que sea divisible por 400
                    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                        if (day > 29) {
                            return false;
                        }
                    } else {
                        if (day > 28) {
                            return false;
                        }
                    }
                }

                // Validar meses con 30 días
                if ([4, 6, 9, 11].includes(month) && day > 30) {
                    return false;
                }

                return true;
            }).withMessage('Fecha de nacimiento inválida')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('La fecha de nacimiento del trabajador no debe tener espacios al inicio ni al final'),

        check('celular')
            .notEmpty().withMessage('El celular del trabajador es obligatorio')
            .isMobilePhone('es-PE').withMessage('El formato del celular no es válido')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El celular del trabajador no debe tener espacios al inicio ni al final'),


        check('email')
            .notEmpty().withMessage('El email del trabajador es obligatorio')
            .isEmail().withMessage('El formato del email no es válido')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El email del trabajador no debe tener espacios al inicio ni al final'),

        // Validación de DNI único
        check('user_dni').custom(async (value, { req }) => {
            const trabajador = await Trabajador.findOne({ dni: value });
            if (trabajador && (req.params.id !== trabajador._id.toString())) {
                throw new Error('El DNI ya está registrado');
            }
        }),

        // Validación de correo único
        check('email').custom(async (value, { req }) => {
            const lowerCaseEmail = value.toLowerCase();
            const trabajador = await Trabajador.findOne({ email: lowerCaseEmail });
            if (trabajador && (req.params.id !== trabajador._id.toString())) {
                throw new Error('Este correo ya está registrado');
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                const checkError = errors.array().map(error => error.msg);

                res.status(400).json({
                    msg: checkError
                })
                return;
            }
            next();
        }
    ]
}

export default validationTrabajador