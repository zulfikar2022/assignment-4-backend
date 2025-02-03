import { NextFunction, Request, Response, Router } from "express";
import { auth, Roles } from "../middlewares/authentication.middleware.js";
import { orderControllers } from "./orders.controllers.js";
import { orderSchemas } from "./orders.validation.js";
import { sendError } from "../error_success/customError.js";
import { StatusCodes } from "http-status-codes";

const orderRoutes = Router();

// for creating an order
orderRoutes.post(
  "/",
  auth([Roles.CUSTOMER]),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      orderSchemas.createOrderSchema.parse(req.body);
      next();
    } catch (error: any) {
      sendError(error, StatusCodes.BAD_REQUEST, res);
    }
  },
  orderControllers.createOrder
);

// for canceling an order
orderRoutes.delete(
  "/:orderId",
  auth([Roles.CUSTOMER, Roles.ADMIN]),
  orderControllers.cancelOrder
);

// for fetching a specific order
orderRoutes.get(
  "/:orderId",
  auth([Roles.CUSTOMER, Roles.ADMIN]),
  orderControllers.specificOrder
);
// for fetching customer specific orders
orderRoutes.get(
  "/customer-order/specific-orders",
  auth([Roles.CUSTOMER, Roles.ADMIN]),
  orderControllers.customerSpecificOrders
);

// for fetching all orders
orderRoutes.get("/", auth([Roles.ADMIN]), orderControllers.getAllOrders);

export default orderRoutes;
