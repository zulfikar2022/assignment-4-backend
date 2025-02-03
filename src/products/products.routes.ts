import { Router } from "express";
import { productsController } from "./products.controller.js";

const productRoutes = Router();

// GET /products

// get all products
productRoutes.get("/", productsController.getAllProducts);

// get specific product
productRoutes.get("/:productId", productsController.getProductById);

export { productRoutes };
