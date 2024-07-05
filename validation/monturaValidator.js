import { check, validationResult } from "express-validator";
import Montura from "../models/Montura.js";

const validationMontura = () => {
    return [
        check('genero')
            .notEmpty().withMessage('El género es obligario'),

        check('forma')
            .notEmpty().withMessage('La forma de la montura es obligatoria')
            .isLength({ min: 4 }).withMessage('La forma de la montura debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('La forma de la montura debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('La forma de la montura no debe tener espacios al inicio ni al final'),

        check('color')
            .notEmpty().withMessage('El color de la montura es obligatorio')
            .isLength({ min: 4 }).withMessage('El color de la montura debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('El color de la montura debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El color de la montura no debe tener espacios al inicio ni al final'),

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

export default validationMontura