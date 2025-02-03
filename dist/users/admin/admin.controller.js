import { adminServices } from "./admin.service.js";
import { sendSuccess } from "../../error_success/customSuccess.js";
import { sendError } from "../../error_success/customError.js";
const userStatusChange = async (req, res) => {
    try {
        const data = await adminServices.userStatusChangeIntoDB(req.params.userId);
        sendSuccess("User status changed successfully", 200, data, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
// Product related controllers are here
const createProduct = async (req, res) => {
    try {
        const data = await adminServices.createProductIntoDB(req.body);
        sendSuccess("Product created successfully", 201, data, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await adminServices.deleteProductIntoDb(productId);
        sendSuccess("Product deleted Successfully", 200, deletedProduct, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedProduct = await adminServices.updateProductIntoDB(productId, req.body);
        sendSuccess("Product updated successfully", 200, updatedProduct, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
const changeOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        const updatedOrder = await adminServices.changeOrderStatusIntoDB(orderId, newStatus);
        sendSuccess("Order status changed successfully", 200, updatedOrder, res);
    }
    catch (error) {
        // sendError(error, error.statusCode, res);
        sendError(error, error.statusCode, res);
    }
};
const getAllCustomers = async (req, res) => {
    let { limit, page, search } = req.query;
    let frontendLimit = parseInt(limit);
    let frontendPage = parseInt(page);
    if (!limit || parseInt(limit) < 0)
        frontendLimit = 10;
    if (!page || parseInt(page) < 0)
        frontendPage = 1;
    try {
        const allCustomers = await adminServices.getAllCustomersFromDB(frontendPage, frontendLimit, search);
        const totalCustomers = await adminServices.getTotalNumberOfCustomersFromDB();
        const totalPage = Math.ceil(totalCustomers / frontendLimit);
        const pagination = {
            limit: frontendLimit,
            page: frontendPage,
            total: totalCustomers,
            totalPage,
        };
        const dataToSend = { ...allCustomers, pagination };
        sendSuccess("All customers fetched successfully", 200, dataToSend, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
const getCustomer = async (req, res) => {
    try {
        const customer = await adminServices.getCustomerFromDB(req.params.userId);
        sendSuccess("Customer fetched successfully", 200, customer, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
export const adminController = {
    userStatusChange,
    createProduct,
    deleteProduct,
    updateProduct,
    changeOrderStatus,
    getAllCustomers,
    getCustomer,
};
