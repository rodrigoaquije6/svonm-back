import { check, validationResult } from 'express-validator';
import Producto from '../models/producto.model.js'; // Asegúrate de importar correctamente tu modelo Producto

const validationProducto = (tipoProducto) => {
    return (req, res, next) => {
        switch (tipoProducto) {
            case 'Montura':
                monturaValidator()(req, res, next);
                break;
            case 'Lentes de Sol':
                lentesolValidator()(req, res, next);
                break;
            default:
                [
                    check('codigo')
                        .notEmpty().withMessage('El código del producto es obligatorio')
                        .matches(/^[A-Z0-9]+$/).withMessage('El código debe contener solo letras mayúsculas y/o números')
                        .isLength({ max: 15 }).withMessage('El código no debe exceder los 15 caracteres')
                        .custom(value => !/\s/.test(value)).withMessage('El código no debe contener espacios en blanco'),

                    check('nombre')
                        .notEmpty().withMessage('El nombre del producto es obligatorio')
                        .isLength({ min: 4 }).withMessage('El nombre del producto debe tener al menos 4 letras')
                        .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
                        .withMessage('El nombre del producto debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
                        .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre del producto no debe tener espacios al inicio ni al final'),

                    check('precio')
                        .notEmpty().withMessage('El precio es obligatorio')
                        .isFloat({ gt: 0 }).withMessage('El precio no debe ser 0 ni negativo')
                        .isFloat({ lt: 1000 }).withMessage('El precio no debe exceder los 1000')
                        .custom(value => !isNaN(parseFloat(value))).withMessage('El precio no puede contener letras o signos'),

                    check('marca')
                        .notEmpty().withMessage('La marca del producto es obligatoria'),

                    check('proveedor')
                        .notEmpty().withMessage('El proveedor del producto es obligatorio'),

                    // Validación de nombre único (case-sensitive)
                    check('codigo').custom(async (value, { req }) => {
                        let producto = await Producto.findOne({ codigo: value }).collation({ locale: 'es', strength: 2 });

                        if (producto && (req.params.id !== producto._id.toString())) {
                            throw new Error('El producto ya está registrado');
                        }

                        // Verificar también el nombre en minúsculas
                        const productoLower = await Producto.findOne({ codigo: value.toLowerCase() });
                        if (productoLower && (req.params.id !== productoLower._id.toString())) {
                            throw new Error('El producto ya está registrado');
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
                ](req, res, next);
        }
    };
};

export default validationProducto;