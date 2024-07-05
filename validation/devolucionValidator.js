import { check, validationResult } from "express-validator";

const devolucionValidator = () => {
    return [
        check('motivo')
            .notEmpty().withMessage('El motivo de la devolución es obligatorio'),

        check('observacion')
            .notEmpty().withMessage('La observación de la devolución es obligatoria')
            .custom(value => !(/^\s|\s$/.test(value)))
            .withMessage('La observación no debe tener espacios en blanco al inicio o al final'),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const checkError = errors.array().map(error => error.msg);
                return res.status(400).json({
                    errors: checkError
                });
            }
            next();
        }
    ];
};

export default devolucionValidator;