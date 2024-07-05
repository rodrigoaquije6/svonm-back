import { validationResult } from 'express-validator';
import monturaValidator from './monturaValidator.js';
import lentesSolValidator from './lenteSolValidator.js';
import productoValidator from './productoValidator.js';

const validationProductos = (tipoProducto) => {
    return async (req, res, next) => {
        try {
            switch (tipoProducto) {
                case 'Montura':
                    // Obtenemos las validaciones específicas para Montura
                    const monturaValidations = monturaValidator();
                    // Ejecutamos todas las validaciones en paralelo
                    await Promise.all(monturaValidations.map(validation => validation(req, res)));
                    break;

                case 'Lentes de Sol':
                    // Obtenemos las validaciones específicas para Lentes de Sol
                    const lentesSolValidations = lentesSolValidator();
                    // Ejecutamos todas las validaciones en paralelo
                    await Promise.all(lentesSolValidations.map(validation => validation(req, res)));
                    break;

                default:
                    // Si no se especifica Montura ni Lentes de Sol, utilizamos las validaciones genéricas
                    const productoValidationsGenerico = productoValidator();
                    // Ejecutamos todas las validaciones en paralelo
                    await Promise.all(productoValidationsGenerico.map(validation => validation(req, res)));
                    break;
            }

            // Después de ejecutar todas las validaciones, verificamos si hay errores
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Si hay errores, respondemos con un estado 400 y los errores en formato JSON
                return res.status(400).json({ errors: errors.array() });
            }

            // Si no hay errores, llamamos a `next()` para pasar al siguiente middleware o controlador
            next();
        } catch (err) {
            // Si ocurre un error durante la validación, lo pasamos a `next()` para manejarlo globalmente
            next(err);
        }
    };
};

export default validationProductos;