import { check, validationResult } from "express-validator";
import Marca from "../models/Crear-marca.js";

const validationMarca = () => {
    return [
        check('nombre').notEmpty().withMessage('El nombre de la marca es obligatorio'),
        check('nombre').matches(/^[A-Za-zÁ-Úá-ú\s]+$/).withMessage('El nombre de la marca no contiene números ni simbolos'),

        // Validación de nombre único
        check('nombre').custom(async (value, { req }) => {
            const marca = await Marca.findOne({ nombre: value });
            if (marca && (req.params.id !== marca._id.toString())) {
                throw new Error('La marca ya está registrada');
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

export default validationMarca