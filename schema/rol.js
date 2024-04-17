const { z } = require('zod');

// Define el esquema de validación para el modelo Rol
const RolSchema = z.object({
    nombre: z.string().max(25).nonempty().optional(),
}).refine(data => data.nombre !== undefined, {
    message: 'El nombre es obligatorio'
});

module.exports = RolSchema;