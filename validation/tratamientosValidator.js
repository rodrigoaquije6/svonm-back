import { check, validationResult } from "express-validator";
import Tratamiento from "../models/tratamiento.js";

const tratamientoValidator = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre del tratamiento es obligatorio')
            .isLength({ min: 2 }).withMessage('El nombre del tratamiento debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ]{2}$|^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del tratamiento debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del tratamiento no debe tener espacios al inicio ni al final'),

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
            // Buscar tratamiento sin considerar la capitalización
            let tratamiento = await Tratamiento.findOne({ nombre: value }).collation({ locale: 'es', strength: 2 });

            if (tratamiento && (req.params.id !== tratamiento._id.toString())) {
                throw new Error('El tratamiento ya está registrado');
            }

            // Verificar también el nombre en minúsculas
            const tratamientoLower = await Tratamiento.findOne({ nombre: value.toLowerCase() });
            if (tratamientoLower && (req.params.id !== tratamientoLower._id.toString())) {
                throw new Error('El tratamiento ya está registrado');
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

export default tratamientoValidator;