import { check, validationResult, body } from 'express-validator';
import mongoose from 'mongoose';

const ventaValidator = () => {
    return [
        // Campos del ojo derecho (derecho)
        check('oDEsfera')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('La esfera del ojo derecho debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('La esfera del ojo derecho debe comenzar con un signo + o -');
                }
                return true;
            }),

        check('oDCilindro')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El cilindro del ojo derecho debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El cilindro del ojo derecho debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('oDEje')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,3}$/.test(value)) {
                    throw new Error('El eje del ojo derecho debe ser un número entero entre 0 y 180, y no contener espacios en blanco');
                }
                return true;
            })
            .trim(),

        check('oDAvLejos')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,2}\/\d{1,2}$/.test(value)) {
                    throw new Error('La agudeza visual lejos del ojo derecho debe estar en el formato X/X y no contener espacios en blanco');
                }
                return true;
            })
            .trim(),

        check('oDAvCerca')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,2}\/\d{1,2}$/.test(value)) {
                    throw new Error('La agudeza visual cerca del ojo derecho debe estar en el formato X/X y no contener espacios en blanco');
                }
                return true;
            })
            .trim(),

        check('oDAdd')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El add del ojo derecho debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El add del ojo derecho debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('oDAltura')
            .optional()
            .custom((value, { req }) => {
                if (value) {
                    if (!Number.isInteger(Number(value))) {
                        throw new Error('La altura del ojo derecho debe ser un número entero');
                    }
                    if (value.trim() !== value) {
                        throw new Error('La altura del ojo derecho no puede contener espacios en blanco');
                    }
                }
                return true;
            })
            .trim(),

        check('oDCurva')
            .optional()
            .custom((value, { req }) => {
                if (value) {
                    if (!Number.isInteger(Number(value))) {
                        throw new Error('La curva del ojo derecho debe ser un número entero');
                    }
                    if (value.trim() !== value) {
                        throw new Error('La curva del ojo derecho no puede contener espacios en blanco');
                    }
                }
                return true;
            })
            .trim(),

        // Campos del ojo izquierdo (izquierdo)
        check('oIEsfera')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('La esfera del ojo izquierdo debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('La esfera del ojo izquierdo debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('oICilindro')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El cilindro del ojo izquierdo debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El cilintro del ojo izquierdo debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('oIEje')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,3}$/.test(value)) {
                    throw new Error('El eje del ojo izquierdo debe ser un número entero entre 0 y 180, y no contener espacios en blanco');
                }
                return true;
            }).trim(),

        check('oIAvLejos')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,2}\/\d{1,2}$/.test(value)) {
                    throw new Error('La agudeza visual lejos del ojo izquierdo debe estar en el formato X/X y no contener espacios en blanco');
                }
                return true;
            })
            .trim(),

        check('oIAvCerca')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^\d{1,2}\/\d{1,2}$/.test(value)) {
                    throw new Error('La agudeza visual cerca del ojo izquierdo debe estar en el formato X/X y no contener espacios en blanco');
                }
                return true;
            }).trim(),

        check('oIAdd')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El add del ojo izquierdo debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El add del ojo izquierdo debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('oIAltura')
            .optional()
            .custom((value, { req }) => {
                if (value) {
                    if (!Number.isInteger(Number(value))) {
                        throw new Error('La altura del ojo izquierdo debe ser un número entero');
                    }
                    if (value.trim() !== value) {
                        throw new Error('La altura del ojo izquierdo no puede contener espacios en blanco');
                    }
                }
                return true;
            }).trim(),

        check('oICurva')
            .optional()
            .custom((value, { req }) => {
                if (value) {
                    if (!Number.isInteger(Number(value))) {
                        throw new Error('La curva del ojo izquierdo debe ser un número entero');
                    }
                    if (value.trim() !== value) {
                        throw new Error('La altura del ojo izquierdo no puede contener espacios en blanco');
                    }
                }
                return true;
            }).trim(),

        // Otros campos de la venta
        check('dipLejos')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El dip de lejos debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El dip de lejos debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        check('dipCerca')
            .optional()
            .custom((value, { req }) => {
                if (value && !/^[+-]?\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('El dip de cerca debe ser un número válido en el formato. EJM: +3.44 o -2.44, y no contener espacios en blanco');
                } if (value && !/^[+-]/.test(value)) {
                    throw new Error('El dip de cerca debe comenzar con un signo + o -');
                }
                return true;
            })
            .trim(),

        // Campo observacion
        check('observacion')
            .trim().not().isEmpty().withMessage('La observación no puede estar vacía')
            .isString().withMessage('La observación debe ser texto')
            .custom(value => !(/^\s|\s$/.test(value)))
            .withMessage('La observación no debe tener espacios en blanco al inicio o al final'),

        // IDs de referencias
        check('idCliente').exists().withMessage('El ID del cliente es requerido').isMongoId().withMessage('ID de cliente no válido'),

        // Opcionales
        check('idTipoLuna')
            .optional()
            .custom((value, { req }) => {
                if (value && !mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Tipo de luna no válido');
                }
                return true;
            }),

        check('idMaterialLuna')
            .optional()
            .custom((value, { req }) => {
                if (value && !mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Material de luna no válido');
                }
                return true;
            }),

        // Productos
        check('productosAgregados').isArray({ min: 1 }).withMessage('Debe haber al menos un producto agregado'),

        check('saldo')
            .exists().withMessage('El saldo es requerido')
            .isFloat({ min: 0 }).withMessage('El saldo debe ser un número positivo'),

        check('total')
            .exists().withMessage('El total es requerido')
            .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),

        // Validación para "a cuenta" y "total"
        check('aCuenta').custom((value, { req }) => {
            const camposOculares = ['oDEsfera', 'oDCilindro', 'oDEje', 'oDAvLejos', 'oDAvCerca', 'oDAdd', 'oDAltura', 'oDCurva', 'oIEsfera', 'oICilindro', 'oIEje', 'oIAvLejos', 'oIAvCerca', 'oIAdd', 'oIAltura', 'oICurva', 'dipLejos', 'dipCerca'];

            const camposOcularesCompletos = camposOculares.every(campo => req.body[campo]);

            if ((!req.body.idTipoLuna || !req.body.idMaterialLuna) || !camposOcularesCompletos) {
                if (value !== req.body.total) {
                    throw new Error('A cuenta debe ser igual al total si no se elige un tipo de luna o material de luna, o si los campos oculares no están completos. Asegurese de tener todos los datos para tratamientos oculares completos.');
                }
            }
            return true;
        }),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Lista de campos que deben estar presentes si se ingresa al menos uno
            const camposOcularesDerecho = ['oDEsfera', 'oDCilindro', 'oDEje', 'oDAvLejos', 'oDAvCerca', 'oDAdd', 'oDAltura', 'oDCurva'];
            const camposOcularesIzquierdo = ['oIEsfera', 'oICilindro', 'oIEje', 'oIAvLejos', 'oIAvCerca', 'oIAdd', 'oIAltura', 'oICurva'];
            const camposDiplopia = ['dipLejos', 'dipCerca'];
            const camposIDs = ['idTipoLuna', 'idMaterialLuna'];
            const camposTratamientos = ['tratamientosAgregados'];

            // Función para verificar si algún campo está presente en la solicitud
            const algunoIngresado = [...camposOcularesDerecho, ...camposOcularesIzquierdo, ...camposDiplopia, ...camposIDs, ...camposTratamientos]
                .some(campo => {
                    if (Array.isArray(req.body[campo])) {
                        return req.body[campo].length > 0; // Verificar si hay algún tratamiento agregado
                    }
                    return req.body[campo] !== undefined && req.body[campo] !== null && req.body[campo] !== "";
                });

            // Verificar si todos los campos requeridos están presentes
            if (algunoIngresado) {
                const todosPresentes = camposOcularesDerecho.concat(camposOcularesIzquierdo, camposDiplopia, camposIDs)
                    .every(campo => req.body[campo] !== undefined && req.body[campo] !== null && req.body[campo] !== "");

                if (!todosPresentes) {
                    const camposFaltantes = camposOcularesDerecho.concat(camposOcularesIzquierdo, camposDiplopia, camposIDs)
                        .filter(campo => req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === "");

                    return res.status(400).json({ errors: [{ msg: `Usted selecciono un campo para realizar un tratamiento ocular y debe completar todos los campos requeridos: ${camposFaltantes.join(', ')}` }] });
                }
            }

            next();
        }
    ];
};

export default ventaValidator;