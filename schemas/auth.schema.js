import { z } from "zod";

export const registerSchema = z.object({
    user_dni: z
      .string({
        required_error: "El DNI es requerido",
      })
      .regex(new RegExp(/^[0-9]+$/), {
        message: "Revise el campo de DNI (Solo números)",
      })
      .length(8, {
        message: "EL DNI debe tener 8 dígitos",
      }),
  
    role: z
      .string({
        required_error: "El Rol es requerido",
      })
      .length(1, {
        message: "El Rol debe tener 1 dígito",
      })
      .regex(new RegExp(/^[0-9]+$/), {
        message: "Revise el campo de Rol (Elija una opción)",
      }),
  
    pnombre: z
      .string({
        required_error: "El nombre es requerido",
      })
      .min(1, {
        message: "El nombre es requerido",
      })
      .regex(new RegExp(/^[a-zA-ZñÑ]+$/), {
        message: "Revise el campo de Nombre (Solo letras)",
      }),
  
    snombre: z.string().regex(new RegExp(/^$|^[a-zA-ZñÑ]+$/), {
      message: "Revise el campo de Segundo Nombre (Solo letras)",
    }),
  
    apellidop: z
      .string({
        required_error: "El Apellido paterno es requerido",
      }).min(1, {
        message: "El Apellido paterno es requerido",
      })
      .regex(new RegExp(/^[a-zA-ZñÑ]+$/), {
        message: "Revise el campo de Apellido Paterno (Solo letras)",
      }),
  
    apellidom: z
      .string({
        required_error: "El Apellido materno es requerido",
      }).min(1, {
        message: "El Apellido materno es requerido",
      })
      .regex(new RegExp(/^[a-zA-ZñÑ]+$/), {
        message: "Revise el campo de Apellido Materno (Solo letras)",
      }),
  
    username: z.string({
      required_error: "El usuario es requerido",
    }).min(1, {
      message: "El nombre de usuario es requerido",
    }),
  
    password: z
      .string({
        required_error: "La contraseña es requerida",
      })
      .min(6, {
        message: "El password debe tener al menos 6 caracteres",
      }),
  
    celular: z
      .string({
        required_error: "Un numero celular es requerido",
      })
      .regex(new RegExp(/^[0-9]+$/), {
        message: "Revise el campo de Celular (Solo números)",
      })
      .length(9, {
        message: "El celular debe tener 9 dígitos",
      }),
  
    fecha_nac: z.coerce
      .date({
        required_error: "La fecha de nacimiento es requerida",
      })
      .min(new Date("1930-01-01"), {
        message: "Como sigues vivo?",
      })
      .max(new Date("2005-01-01"), {
        message: "El registrado debe ser mayor de 18 años",
      }),
    email: z
      .string({
        required_error: "Un email es requerido",
      })
      .email({
        message: "Email inválido",
      }),
  });

export const loginSchema = z.object({
    email: z
      .string({
        required_error: "El email es requerido",
      })
      .email({
        message: "Email Inválido",
      }),
    password: z
      .string({
        required_error: "El password es requerido",
      })
      .min(6, {
        message: "El password debe tener al menos 6 caracteres",
      }),
  });
  