import { check, validationResult } from "express-validator";

const validationTrabajador = () => {
    return [
        check('dni').notEmpty().withMessage('El DNI es obligario'),
        check('dni').isNumeric().withMessage('El DNI no contiene letras'),
        check('dni').isLength( ({ min: 8, max:8 }) ).withMessage('El DNI tiene 8 números'),

        check('nombre').notEmpty().withMessage('El nombre es obligario'),
        check('nombre').isString().withMessage('El nombre no contiene números'),

        check('rol').notEmpty().withMessage('El rol es obligario'),
        check('rol').isIn(['Gerente', 'Trabajador']).withMessage('El rol no es válido'),

        check('estado').notEmpty().withMessage('El estado es obligario'),
        check('estado').isIn(['Activo', 'Inactivo']).withMessage('El estado no es válido'),

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