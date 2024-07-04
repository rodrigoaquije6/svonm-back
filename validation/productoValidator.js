import { check, validationResult } from 'express-validator';
import Producto from '../models/producto.model.js'; // Asegúrate de importar correctamente tu modelo Producto

const validationProducto = () => {
    return [
        check('codigo')
            .notEmpty().withMessage('El código del producto es obligatorio')
            .matches(/^[A-Z][A-Z0-9]{0,9}$/).withMessage('El código debe empezar con una letra mayúscula, contener solo letras mayúsculas y números, y no ser mayor a 10 caracteres')
            .custom(value => !/\s/.test(value)).withMessage('El código no debe contener espacios en blanco'),

        check('nombre')
            .notEmpty().withMessage('El nombre del producto es obligatorio')
            .isLength({ min: 3 }).withMessage('El nombre del tipo de producto debe tener al menos 3 letras')
            .matches(/^[A-Z][a-záéíóúüñÁÉÍÓÚÜÑ\s]*$/).withMessage('El nombre del producto debe empezar con mayúscula seguida de minúsculas y no debe contener números ni símbolos'),

        check('precio')
            .notEmpty().withMessage('El precio del producto es obligatorio')
            .isFloat({ min: 0 }).withMessage('El precio del producto debe ser mayor o igual a 0'),

        check('imagen')
            .optional()
            .matches(/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/).withMessage('Ingresar un URL de imagen correcto'),

        // Validación de nombre único (case-insensitive)
        check('nombre').custom(async (value, { req }) => {
            const nombreNormalizado = value.toLowerCase();
            const productos = await Producto.find();
            const existingProductos = productos.map(producto => producto.nombre.toLowerCase());

            if (existingProductos.some(existingProducto =>
                existingProducto.includes(nombreNormalizado) ||
                nombreNormalizado.includes(existingProductos)
            )) {
                throw new Error('El código del producto ya está registrado o es muy similar a un código existente');
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

export default validationProducto