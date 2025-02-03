import { StatusCodes } from "http-status-codes";
import { CustomError } from "../error_success/customError.js";
import { Order } from "./orders.model.js";
import { TOrder } from "./orders.types.js";
import { jwtDecode } from "jwt-decode";
import { TTokenPayload } from "../error_success/types.token.js";
import { ObjectId } from "mongoose";

const crateAnOrderIntoDB = async (order: TOrder): Promise<TOrder> => {
  try {
    const newOrder = new Order(order);
    const data = await newOrder.save();
    return data;
  } catch (error: any) {
    throw new CustomError("Order creation failed", StatusCodes.BAD_REQUEST);
  }
};

const cancelAnOrderFromDB = async (
  orderId: string,
  token: string
): Promise<TOrder> => {
  try {
    const order: TOrder | null = await Order.findById(orderId);
    const { _id, role } = jwtDecode(token) as TTokenPayload;
    if (role !== "admin" && order?.userId !== _id) {
      throw new CustomError("Unauthorized User", StatusCodes.UNAUTHORIZED);
    }
    if (!order) {
      throw new CustomError("Order not found", StatusCodes.NOT_FOUND);
    }
    if (order.isCanceled) {
      throw new CustomError("Order already canceled", StatusCodes.BAD_REQUEST);
    }
    if (order.orderStatus === "Delivered" || order.orderStatus === "Shipped") {
      throw new CustomError("Order can't be canceled", StatusCodes.BAD_REQUEST);
    }
    order.isCanceled = true;
    return await order.save();
  } catch (error: any) {
    throw error;
  }
};

const getAllOrdersFromDB = async (
  page: number,
  limit: number,
  search: string
): Promise<TOrder[]> => {
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
    return await Order.find({ isCanceled: false, ...searchQuery })
      .skip(skipped)
      .limit(limit);
  } catch (error: any) {
    throw new CustomError("Failed to fetch orders", StatusCodes.BAD_REQUEST);
  }
};

const getTotalOrdersCountFromDB = async (): Promise<number> => {
  try {
    return await Order.countDocuments({ isCanceled: false });
  } catch (error: any) {
    throw new CustomError("Failed to fetch orders", StatusCodes.BAD_REQUEST);
  }
};

const getSpecificOrderFromDB = async (orderId: string): Promise<TOrder> => {
  try {
    const order: TOrder | null = await Order.findById(orderId);

    if (!order) {
      throw new CustomError("Order not found", StatusCodes.NOT_FOUND);
    }
    return order;
  } catch (error: any) {
    throw new CustomError("Failed to fetch order", StatusCodes.BAD_REQUEST);
  }
};
const getCustomerSpecificOrdersFromDB = async (
  customerId: string
): Promise<TOrder[]> => {
  try {
    return await Order.find({ userId: customerId, isCanceled: false });
  } catch (error: any) {
    throw new CustomError("Failed to fetch orders", StatusCodes.BAD_REQUEST);
  }
};

export const orderServices = {
  crateAnOrderIntoDB,
  cancelAnOrderFromDB,
  getAllOrdersFromDB,
  getSpecificOrderFromDB,
  getTotalOrdersCountFromDB,
  getCustomerSpecificOrdersFromDB,
};
