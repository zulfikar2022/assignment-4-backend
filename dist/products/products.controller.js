import { productsServices } from "./products.service.js";
import { sendSuccess } from "../error_success/customSuccess.js";
import { sendError } from "../error_success/customError.js";
const getAllProducts = async (req, res) => {
    let { limit, page, search } = req.query;
    let frontendLimit = parseInt(limit);
    let frontendPage = parseInt(page);
    if (!limit || parseInt(limit) < 0)
        frontendLimit = 10;
    if (!page || parseInt(page) < 0)
        frontendPage = 1;
    try {
        const products = await productsServices.getAllProductsFromDB(frontendPage, frontendLimit, search);
        const totalProducts = await productsServices.getTotalProductsCountFromDB();
        const totalPage = Math.ceil(totalProducts / frontendLimit);
        const pagination = {
            limit: frontendLimit,
            page: frontendPage,
            total: totalProducts,
            totalPage,
        };
        const dataToSend = { ...products, pagination };
        sendSuccess("All products fetched successfully", 200, dataToSend, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await productsServices.getProductByIdFromDB(req.params.productId);
        sendSuccess("Product fetched successfully", 200, product, res);
    }
    catch (error) {
        sendError(error, error.statusCode, res);
    }
};
export const productsController = { getAllProducts, getProductById };
