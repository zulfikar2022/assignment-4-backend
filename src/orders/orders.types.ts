import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface TOrder extends Document {
  userId: string;
  productId: string;
  quantity: number;
  orderDate?: Date;
  totalAmount: number;
  shippingAddress: string;
  orderStatus?:
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered";
  email: string;
  phone: string;
  isPaid: boolean;
  address: string;
  isCanceled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
