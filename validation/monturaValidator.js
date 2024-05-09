import { check, validationResult } from "express-validator";
import Montura from "../models/Montura.js";

const validationMontura = () => {
    return [
        check('codigo').notEmpty().withMessage('El código es obligatorio'),
        check('codigo').matches(/^[A-Z0-9]+$/).withMessage('El código solo contiene mayúsculas y números'),

        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('nombre').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('El nombre no contiene números ni simbolos'),

        check('precio').notEmpty().withMessage('El precio es obligatorio'),
        check('precio').isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),

        check('imagen').notEmpty().withMessage('La imagen es obligatoria'),
        check('imagen').matches(/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/).withMessage('El nombre no contiene números ni simbolos'),

        check('marca').notEmpty().withMessage('La marca es obligatoria'),

        check('genero').notEmpty().withMessage('El género es obligario'),

        check('forma').notEmpty().withMessage('La forma de la montura es obligatorio'),
        check('forma').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('La forma no contiene números ni símbolos'),

        check('color').notEmpty().withMessage('El color de la montura es obligatorio'),
        check('color').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('El color no contiene números ni símbolos'),

        // Validación de código único
        check('codigo').custom(async (value, { req }) => {
            const montura= await Montura.findOne({ codigo: value });
            if (montura && (req.params.id !== montura._id.toString())) {
                throw new Error('La montura ya está registrada');
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

export default validationMontura