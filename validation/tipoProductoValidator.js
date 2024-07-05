import { check, validationResult } from "express-validator";
import TipoProducto from "../models/TipoProducto.js";

const validationTipoProducto = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre del tipo de producto es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre del tipo de producto debe tener al menos 4 caracteres')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre del tipo de producto debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del tipo de producto no debe tener espacios al inicio ni al final'),

        // Validación de nombre único (case-sensitive)
        check('nombre').custom(async (value, { req }) => {
            // Buscar tipo de producto sin considerar la capitalización
            let tipoProducto = await TipoProducto.findOne({ nombre: value }).collation({ locale: 'es', strength: 2 });

            if (tipoProducto && (req.params.id !== tipoProducto._id.toString())) {
                throw new Error('El tipo de producto ya está registrado');
            }

            // Verificar también el nombre en minúsculas
            const tipoProductoLower = await TipoProducto.findOne({ nombre: value.toLowerCase() });
            if (tipoProductoLower && (req.params.id !== tipoProductoLower._id.toString())) {
                throw new Error('El tipo de producto ya está registrado');
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