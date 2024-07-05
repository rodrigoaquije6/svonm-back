import { check, validationResult } from "express-validator";
import TipoLuna from "../models/tipoLuna.js";

const tipoLunaValidator = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El tipo de luna es obligatorio')
            .isLength({ min: 4 }).withMessage('El tipo de luna debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('El tipo de luna debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El tipo de luna no debe tener espacios al inicio ni al final'),

        check('precio')
            .notEmpty().withMessage('El precio es obligatorio')
            .isFloat({ gt: 0 }).withMessage('El precio no debe ser 0 ni negativo')
            .isFloat({ lt: 1000 }).withMessage('El precio no debe excederse a 1000')
            .custom(value => {
                // Verificar que el precio no contenga caracteres no numéricos
                if (isNaN(value)) {
                    return false;
                }
                return true;
            }).withMessage('El precio no puede contener letras o signos'),

        // Validación de nombre único (case-sensitive)
        check('nombre').custom(async (value, { req }) => {
            let tipoLuna = await TipoLuna.findOne({ nombre: value }).collation({ locale: 'es', strength: 2 });

            if (tipoLuna && (req.params.id !== tipoLuna._id.toString())) {
                throw new Error('El tipo de luna ya está registrado');
            }

            // Verificar también el nombre en minúsculas
            const tipoLower = await TipoLuna.findOne({ nombre: value.toLowerCase() });
            if (tipoLower && (req.params.id !== tipoLower._id.toString())) {
                throw new Error('El tipo de luna ya está registrado');
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

export default tipoLunaValidator;