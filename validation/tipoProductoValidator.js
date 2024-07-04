import { check, validationResult } from "express-validator";
import tipoProducto from "../models/TipoProducto.js";

const validationTipoProducto = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre del tipo de producto es obligatorio')
            .isLength({ min: 3 }).withMessage('El nombre del tipo de producto debe tener al menos 3 letras')
            .matches(/^[A-Z][a-záéíóúüñÁÉÍÓÚÜÑ\s]*$/).withMessage('El nombre del tipo de producto debe empezar con mayúscula seguida de minúsculas y no debe contener números ni símbolos')
            .custom(value => !/\s/.test(value)).withMessage('El nombre del tipo de producto no debe contener espacios en blanco'),

        // Validación de nombre único (case-insensitive)
        check('nombre').custom(async (value, { req }) => {
            const nombreNormalizado = value.toLowerCase();
            const tiposP = await tipoProducto.find();
            const existingTipos = tiposP.map(tipo => tipo.nombre.toLowerCase());

            if (existingTipos.some(existingTipo =>
                existingTipo.includes(nombreNormalizado) ||
                nombreNormalizado.includes(existingTipos)
            )) {
                throw new Error('El tipo de producto ya está registrado o es muy similar a un tipo de producto existente');
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

export default validationTipoProducto