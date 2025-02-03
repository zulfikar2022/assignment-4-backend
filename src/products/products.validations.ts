import { BRAND, z } from "zod";

const createProductSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    brand: z.string().nonempty("Brand is required"),
    price: z.number().positive("Price should be greater than 0"),
    productModel: z.string().nonempty("Model is required"),
    stock: z.number().min(0, "Stock should be greater than or equal to 0"),
    imageUrl: z.string().optional().default(""),
  })
  .strict();

const updateProductSchema = z
  .object({
    name: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().optional(),
    productModel: z.string().optional(),
    stock: z.number().min(0, "Stock should be greater than or equal to 0"),
    imageUrl: z.string().optional(),
  })
  .strict();

export const productSchema = {
  createProductSchema,
  updateProductSchema,
};
