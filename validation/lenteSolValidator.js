import { check, validationResult } from "express-validator";
import LenteSol from "../models/LentesSol.js";

const validationLenteSol = () => {
    return [
        check('genero')
            .notEmpty().withMessage('El género es obligatorio'),

        check('forma')
            .notEmpty().withMessage('La forma del lente de sol es obligatoria')
            .isLength({ min: 4 }).withMessage('La forma del lente de sol debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('La forma del lente de sol debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('La forma del lente de sol no debe tener espacios al inicio ni al final'),

        check('color')
            .notEmpty().withMessage('El color de la montura es obligatorio')
            .isLength({ min: 4 }).withMessage('El color de la montura debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('El color de la montura debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El color de la montura no debe tener espacios al inicio ni al final'),

        check('colorlente')
            .notEmpty().withMessage('El color del lente es obligatorio')
            .isLength({ min: 4 }).withMessage('El color del lente debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('El color del lente debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El color del lente no debe tener espacios al inicio ni al final'),

        check('protuv')
            .notEmpty().withMessage('La protección UV es obligatoria'),

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

export default validationLenteSol