import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../error_success/customError.js";
import { User } from "../users.model.js";
import { TProduct } from "../../products/products.types.js";
import Product from "../../products/products.model.js";
import { Order } from "../../orders/orders.model.js";
import { TOrder } from "../../orders/orders.types.js";

const userStatusChangeIntoDB = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    user.isDeactivated = !user.isDeactivated;
    await user.save();
    return { message: "User status changed successfully", user };
  } catch (error) {
    throw error;
  }
};

// product related services are here
const createProductIntoDB = async (product: TProduct) => {
  try {
    const newProduct = new Product(product);
    const data = await newProduct.save();
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteProductIntoDb = async (productId: string) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError("Product not found", StatusCodes.NOT_FOUND);
    }
    product.isDeleted = true;
    const deletedProduct = await product.save();
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

const updateProductIntoDB = async (productId: string, product: TProduct) => {
  try {
    const fetchedProduct = await Product.findById(productId);

    if (!fetchedProduct) {
      throw new CustomError("Product not found", StatusCodes.NOT_FOUND);
    }
    fetchedProduct.name = product.name;
    fetchedProduct.brand = product.brand;
    fetchedProduct.price = product.price;
    fetchedProduct.productModel = product.productModel;
    fetchedProduct.stock = product.stock;
    fetchedProduct.imageUrl = product.imageUrl;
    const updatedProduct = await fetchedProduct.save();
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const changeOrderStatusIntoDB = async (
  orderId: string,
  newStatus: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered"
) => {
  try {
    const order: TOrder | null = await Order.findById(orderId);
    if (!order) {
      throw new CustomError("Order not found", StatusCodes.NOT_FOUND);
    }
    order.orderStatus = newStatus;
    const updatedOrder = await order.save();
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const getAllCustomersFromDB = async (
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
    return await User.find({
      role: "customer",
      ...searchQuery,
    })
      .skip(skipped)
      .limit(limit);
  } catch (error) {
    throw error;
  }
};

const getTotalNumberOfCustomersFromDB = async () => {
  try {
    return await User.countDocuments({ role: "customer" });
  } catch (error) {
    throw error;
  }
};

const getCustomerFromDB = async (userId: string) => {
  try {
    const customer = await User.find({ _id: userId, role: "customer" });

    if (customer.length === 0) {
      throw new CustomError("Customer not found", StatusCodes.NOT_FOUND);
    }
    return customer[0];
  } catch (error) {
    throw error;
  }
};

export const adminServices = {
  userStatusChangeIntoDB,
  createProductIntoDB,
  deleteProductIntoDb,
  updateProductIntoDB,
  changeOrderStatusIntoDB,
  getAllCustomersFromDB,
  getTotalNumberOfCustomersFromDB,
  getCustomerFromDB,
};
