import { check, validationResult } from "express-validator";
import tipoProducto from "../models/TipoProducto.js";

const validationTipoProducto = () => {
    return [
        check('nombre').notEmpty().withMessage('El nombre del tipo de producto es obligatorio'),
        check('nombre').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('El nombre del tipo de producto no contiene números ni simbolos'),

        // Validación de nombre único
        check('nombre').custom(async (value, { req }) => {
            const tipoP = await tipoProducto.findOne({ nombre: value });
            if (tipoP && (req.params.id !== tipoP._id.toString())) {
                throw new Error('El tipo de producto ya está registrado');
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

export default validationTipoProducto