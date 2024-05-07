import { check, validationResult } from "express-validator";
import Luna from "../models/Luna.js";

const validationLuna = () => {
    return [
        check('material').notEmpty().withMessage('El nombre es obligario'),
        check('material').matches(/^[A-Za-z\s]+$/).withMessage('El nombre no contiene números ni símbolos'),

        check('precio').notEmpty().withMessage('El precio es obligatorio'),
        check('precio').isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),

        // Validación de material único tanto para creación como edición
        check('material').custom(async (value, { req }) => {
            const luna = await Luna.findOne({ material: value });
            if (luna && (req.params.id !== luna._id.toString())) {
                throw new Error('La luna ya está registrada');
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
    ];
};

export default validationLuna;