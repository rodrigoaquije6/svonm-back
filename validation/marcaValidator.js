import { check, validationResult } from "express-validator";
import Marca from "../models/Crear-marca.js";

const validationMarca = () => {
    return [
        check('nombre')
            .notEmpty().withMessage('El nombre de la marca es obligatorio')
            .isLength({ min: 4 }).withMessage('El nombre de la marca debe tener al menos 4 caracteres')
            .matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)*$/)
            .withMessage('El nombre de la marca debe empezar con mayúscula seguida de minúsculas, y cada palabra debe comenzar con mayúscula')
            .custom(value => !/^\s|\s$/.test(value)).withMessage('El nombre de la marca no debe tener espacios al inicio ni al final'),

        // Validación de nombre único (case-sensitive)
        check('nombre').custom(async (value, { req }) => {
            // Buscar marca sin considerar la capitalización
            let marca = await Marca.findOne({ nombre: value }).collation({ locale: 'es', strength: 2 });

            if (marca && (req.params.id !== marca._id.toString())) {
                throw new Error('La marca ya está registrada');
            }

            // Verificar también el nombre en minúsculas
            const marcaLower = await Marca.findOne({ nombre: value.toLowerCase() });
            if (marcaLower && (req.params.id !== marcaLower._id.toString())) {
                throw new Error('La marca ya está registrada');
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