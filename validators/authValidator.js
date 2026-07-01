const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email format'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// for Login
const loginSchema = z.object({
    email:z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email format'),

    password:z
    .string()
    .min(6,'password must be at least 6 character')
})

module.exports = { registerSchema, loginSchema };