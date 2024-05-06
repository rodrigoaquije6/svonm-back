import { check, validationResult } from "express-validator";
import Rol from "../models/Rol.js";

const validationRol = () => {
    return [
        check('nombre').notEmpty().withMessage('El nombre del rol es obligatorio'),
        check('nombre').matches(/^[A-Za-z\s]+$/).withMessage('El nombre del rol no contiene números ni simbolos'),

        // Validación de nombre único
        check('nombre').custom(async (value) => {
            const rol = await Rol.findOne({ nombre: value });
            if (rol) {
                throw new Error('El rol ya está registrado');
            }
        }),

        (req, res, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                
                const checkError = errors.array().map(error => error.msg);

                res.status(400).json({
                    msg : checkError
                })
                return;
            }
            next();
        }
    ]
}

export default validationRol