import { Schema, model } from "mongoose";
import { TProduct } from "./products.types.js";

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value > 0;
        },
        message: "Price should be greater than 0",
      },
    },
    productModel: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value >= 0;
        },
        message: "Stock should be greater than or equal to 0",
      },
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

export default Product;
