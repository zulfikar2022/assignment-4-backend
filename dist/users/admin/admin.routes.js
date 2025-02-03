import { Router } from "express";
import { auth, Roles } from "../../middlewares/authentication.middleware.js";
import { adminController } from "./admin.controller.js";
import { productSchema } from "../../products/products.validations.js";
import { CustomError, sendError } from "../../error_success/customError.js";
import { StatusCodes } from "http-status-codes";
const adminRoutes = Router();
// admin route to change users status
adminRoutes.put("/deactivate-or-activate-user/:userId", auth([Roles.ADMIN]), adminController.userStatusChange);
// get all customers
adminRoutes.get("/get-all-customers", auth([Roles.ADMIN]), adminController.getAllCustomers);
// get specific customer
adminRoutes.get("/get-customer/:userId", auth([Roles.ADMIN]), adminController.getCustomer);
// Product related routes are here
// create product
adminRoutes.post("/create-product", auth([Roles.ADMIN]), (req, res, next) => {
    try {
        productSchema.createProductSchema.parse(req.body);
        next();
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.BAD_REQUEST);
        sendError(err, err.statusCode, res);
    }
}, adminController.createProduct);
// delete product
adminRoutes.delete("/delete-product/:productId", auth([Roles.ADMIN]), adminController.deleteProduct);
// update product
adminRoutes.put("/update-product/:productId", (req, res, next) => {
    try {
        productSchema.updateProductSchema.parse(req.body);
        next();
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.BAD_REQUEST);
        sendError(err, err.statusCode, res);
    }
}, auth([Roles.ADMIN]), adminController.updateProduct);
// Orders related routes are here
// change order status
adminRoutes.put("/change-order-status/:orderId", auth([Roles.ADMIN]), adminController.changeOrderStatus);
export { adminRoutes };
