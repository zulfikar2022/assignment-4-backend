import { StatusCodes } from "http-status-codes";
import { CustomError } from "../error_success/customError.js";
import Product from "./products.model.js";

const getAllProductsFromDB = async (
  page: number,
  limit: number,
  search: string
) => {
  const skipped = (page - 1) * limit;

  try {
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find({ isDeleted: false, ...searchQuery })
      .skip(skipped)
      .limit(limit);

    return products;
  } catch (error) {
    throw error;
  }
};

const getTotalProductsCountFromDB = async () => {
  try {
    const count = await Product.countDocuments({ isDeleted: false });
    return count;
  } catch (error) {
    throw error;
  }
};

const getProductByIdFromDB = async (productId: string) => {
  try {
    const product = await Product.find({ _id: productId, isDeleted: false });
    if (!product) {
      throw new CustomError("Product not found", StatusCodes.NOT_FOUND);
    }
    return product[0];
  } catch (error) {
    throw error;
  }
};

export const productsServices = {
  getAllProductsFromDB,
  getProductByIdFromDB,
  getTotalProductsCountFromDB,
};
