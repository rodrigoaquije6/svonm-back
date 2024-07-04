import { check, validationResult } from "express-validator";
import Rol from "../models/Rol.js";

const validationRol = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre del rol es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del rol debe tener al menos 4 letras')
            .matches(/^[A-Z][a-záéíóúüñÁÉÍÓÚÜÑ\s]*$/).withMessage('El nombre del rol debe empezar con mayúscula seguida de minúsculas y no debe contener números ni símbolos')
            .custom(value => !/\s/.test(value)).withMessage('El nombre del rol no debe contener espacios en blanco'),

        // Validación de nombre único (case-insensitive)
        check('nombre').custom(async (value, { req }) => {
            const nombreNormalizado = value.toLowerCase();
            const roles = await Rol.find();
            const existingRoles = roles.map(role => role.nombre.toLowerCase());

            if (existingRoles.some(existingRole =>
                existingRole.includes(nombreNormalizado) ||
                nombreNormalizado.includes(existingRoles)
            )) {
                throw new Error('El rol ya está registrado o es muy similar a un rol existente');
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