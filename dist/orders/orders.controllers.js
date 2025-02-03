import { sendSuccess } from "../error_success/customSuccess.js";
import { CustomError } from "../error_success/customError.js";
import { StatusCodes } from "http-status-codes";
import { orderServices } from "./orders.services.js";
import Product from "../products/products.model.js";
import { jwtDecode } from "jwt-decode";
const createOrder = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const { token } = req.headers;
        const { email } = jwtDecode(token);
        const product = await Product.findById(productId);
        if (!product) {
            return next(new CustomError("Product not found", StatusCodes.NOT_FOUND));
        }
        if (product.stock < quantity) {
            return next(new CustomError("Product out of stock", StatusCodes.BAD_REQUEST));
        }
        const price = product.price * quantity;
        req.body.price = price;
        req.body.email = email;
        req.body.totalAmount = price;
        const order = await orderServices.crateAnOrderIntoDB(req.body);
        sendSuccess("Order created successfully", 201, order, res);
    }
    catch (error) {
        next(error);
    }
};
const cancelOrder = async (req, res, next) => {
    console.log("Inside cancelOrder");
    try {
        const { orderId } = req.params;
        const { token } = req.headers;
        const order = await orderServices.cancelAnOrderFromDB(orderId, token);
        sendSuccess("Order canceled successfully", StatusCodes.OK, order, res);
    }
    catch (error) {
        next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
};
const getAllOrders = async (req, res, next) => {
    let { limit, page, search } = req.query;
    let frontendLimit = parseInt(limit);
    let frontendPage = parseInt(page);
    if (!limit || parseInt(limit) < 0)
        frontendLimit = 10;
    if (!page || parseInt(page) < 0)
        frontendPage = 1;
    try {
        const orders = await orderServices.getAllOrdersFromDB(frontendPage, frontendLimit, search);
        const totalNotCanceledOrders = await orderServices.getTotalOrdersCountFromDB();
        const totalPage = Math.ceil(totalNotCanceledOrders / frontendLimit);
        const pagination = {
            limit: frontendLimit,
            page: frontendPage,
            total: totalNotCanceledOrders,
            totalPage,
        };
        const dataToSend = { ...orders, pagination };
        sendSuccess("Orders fetched successfully", StatusCodes.OK, dataToSend, res);
    }
    catch (error) {
        next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
};
const specificOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await orderServices.getSpecificOrderFromDB(orderId);
        const token = req.headers.token;
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "admin" || order?.userId === decodedToken._id) {
            return sendSuccess("Order fetched successfully", StatusCodes.OK, order, res);
        }
        else {
            throw new CustomError("Unauthorized User", StatusCodes.UNAUTHORIZED);
        }
    }
    catch (error) {
        next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
    }
};
const customerSpecificOrders = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const { _id: customerId } = jwtDecode(token);
        const orders = await orderServices.getCustomerSpecificOrdersFromDB(customerId);
        sendSuccess("Customer specific orders fetched successfully", StatusCodes.OK, orders, res);
    }
    catch (error) {
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
