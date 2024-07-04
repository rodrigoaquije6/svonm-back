import { check, validationResult } from "express-validator";
import Marca from "../models/Crear-marca.js";

const validationMarca = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre de la marca es obligatoria')
            .isLength({ min: 2 }).withMessage('El nombre de la marca debe tener al menos 2 letras')
            .matches(/^[A-Z][a-záéíóúüñÁÉÍÓÚÜÑ\s]*$/).withMessage('El nombre de la marca debe empezar con mayúscula seguida de minúsculas y no debe contener números ni símbolos')
            .custom(value => !/\s/.test(value)).withMessage('El nombre de la marca no debe contener espacios en blanco'),

        // Validación de nombre único (case-insensitive)
        check('nombre').custom(async (value, { req }) => {
            const nombreNormalizado = value.toLowerCase();
            const marcas = await Marca.find();
            const existingMarcas = marcas.map(marca => marca.nombre.toLowerCase());

            if (existingMarcas.some(existingMarca =>
                existingMarca.includes(nombreNormalizado) ||
                nombreNormalizado.includes(existingMarcas)
            )) {
                throw new Error('La marca ya está registrada o es muy similar a una marca existente');
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

export default validationMarca