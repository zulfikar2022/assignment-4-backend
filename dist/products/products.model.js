import { Schema, model } from "mongoose";
const productSchema = new Schema({
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
            validator: function (value) {
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
            validator: function (value) {
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
}, {
    timestamps: true,
});
const Product = model("Product", productSchema);
export default Product;
