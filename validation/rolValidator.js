import { check, validationResult } from "express-validator";
import Rol from "../models/Rol.js";

const validationRol = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre del rol es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del rol debe tener al menos 4 letras')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/).withMessage('El nombre del rol debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del rol no debe tener espacios al inicio ni al final'),

        // Validación de nombre único (case-sensitive)
        check('nombre').custom(async (value, { req }) => {
            const rol = await Rol.findOne({ nombre: value });

            if (rol && (req.params.id !== rol._id.toString())) {
                throw new Error('El rol ya está registrado');
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

export default validationRol