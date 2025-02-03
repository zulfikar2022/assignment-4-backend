import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../error_success/customSuccess.js";
import { CustomError } from "../error_success/customError.js";
import { StatusCodes } from "http-status-codes";
import { TProduct } from "../products/products.types.js";
import { orderServices } from "./orders.services.js";
import Product from "../products/products.model.js";
import { jwtDecode } from "jwt-decode";
import { TTokenPayload } from "../error_success/types.token.js";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const { token } = req.headers;
    const { email }: TTokenPayload = jwtDecode(token as string);
    const product: TProduct | null = await Product.findById(productId);
    if (!product) {
      return next(new CustomError("Product not found", StatusCodes.NOT_FOUND));
    }
    if (product.stock < quantity) {
      return next(
        new CustomError("Product out of stock", StatusCodes.BAD_REQUEST)
      );
    }
    const price = product.price * quantity;
    req.body.price = price;
    req.body.email = email;
    req.body.totalAmount = price;
    const order = await orderServices.crateAnOrderIntoDB(req.body);
    sendSuccess("Order created successfully", 201, order, res);
  } catch (error: any) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Inside cancelOrder");
  try {
    const { orderId } = req.params;
    const { token } = req.headers;

    const order = await orderServices.cancelAnOrderFromDB(
      orderId,
      token as string
    );
    sendSuccess("Order canceled successfully", StatusCodes.OK, order, res);
  } catch (error: any) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { limit, page, search } = req.query as {
    limit: string;
    page: string;
    search: string;
  };
  let frontendLimit: string | number = parseInt(limit);
  let frontendPage: string | number = parseInt(page);

  if (!limit || parseInt(limit) < 0) frontendLimit = 10;
  if (!page || parseInt(page) < 0) frontendPage = 1;

  try {
    const orders = await orderServices.getAllOrdersFromDB(
      frontendPage,
      frontendLimit,
      search
    );

    const totalNotCanceledOrders =
      await orderServices.getTotalOrdersCountFromDB();
    const totalPage = Math.ceil(totalNotCanceledOrders / frontendLimit);

    const pagination = {
      limit: frontendLimit,
      page: frontendPage,
      total: totalNotCanceledOrders,
      totalPage,
    };
    const dataToSend = { ...orders, pagination };

    sendSuccess("Orders fetched successfully", StatusCodes.OK, dataToSend, res);
  } catch (error: any) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const specificOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const order = await orderServices.getSpecificOrderFromDB(orderId);
    const token = req.headers.token as string;
    const decodedToken: TTokenPayload = jwtDecode(token);
    if (decodedToken.role === "admin" || order?.userId === decodedToken._id) {
      return sendSuccess(
        "Order fetched successfully",
        StatusCodes.OK,
        order,
        res
      );
    } else {
      throw new CustomError("Unauthorized User", StatusCodes.UNAUTHORIZED);
    }
  } catch (error: any) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const customerSpecificOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.token as string;
    const { _id: customerId } = jwtDecode(token);
    const orders = await orderServices.getCustomerSpecificOrdersFromDB(
      customerId
    );
    sendSuccess(
      "Customer specific orders fetched successfully",
      StatusCodes.OK,
      orders,
      res
    );
  } catch (error: any) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

export const orderControllers = {
  createOrder,
  cancelOrder,
  getAllOrders,
  specificOrder,
  customerSpecificOrders,
};
