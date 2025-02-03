import { z } from "zod";
const createOrderSchema = z
    .object({
    userId: z.string().nonempty(),
    productId: z.string().nonempty(),
    quantity: z.number().min(1),
    shippingAddress: z.string().nonempty(),
    phone: z.string().nonempty(), // You can add more specific validation if needed
})
    .strict();
export const orderSchemas = {
    createOrderSchema,
};
