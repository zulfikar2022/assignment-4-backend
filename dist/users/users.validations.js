import { z } from "zod";
const registerUserValidation = z
    .object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
})
    .strict();
const loginUserValidation = z
    .object({
    email: z.string().email("Invalid email format"),
    password: z.string(),
})
    .strict();
const updatePasswordValidation = z
    .object({
    oldPassword: z.string(),
    newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
})
    .strict();
export { registerUserValidation, loginUserValidation, updatePasswordValidation, };
