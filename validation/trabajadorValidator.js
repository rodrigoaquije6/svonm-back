import { check, validationResult } from "express-validator";
import Trabajador from "../models/Trabajador.js";

const validationTrabajador = () => {
    return [
        check('dni').notEmpty().withMessage('El DNI es obligatorio'),
        check('dni').isNumeric().withMessage('El DNI no debe contiene letras ni simbolos'),
        check('dni').isLength( ({ min: 8, max:8 }) ).withMessage('El DNI debe tener 8 números'),

        check('nombre').notEmpty().withMessage('El nombre es obligario'),
        check('nombre').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('El nombre no contiene números ni simbolos'),

        check('rol').notEmpty().withMessage('El rol es obligario'),
        check('rol').isIn(['Gerente', 'Trabajador']).withMessage('El rol no es válido'),

        check('estado').notEmpty().withMessage('El estado es obligario'),
        check('estado').isIn(['Activo', 'Inactivo']).withMessage('El estado no es válido'),

        // Validación de DNI único
        check('dni').custom(async (value, { req }) => {
            const trabajador = await Trabajador.findOne({ dni: value });
            if (trabajador && (req.params.id !== trabajador._id.toString())) {
                throw new Error('El DNI ya está registrado');
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

export default validationTrabajador