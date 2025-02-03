import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, "Total amount must be positive"],
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"],
        default: "Pending",
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isCanceled: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
orderSchema.pre("save", function (next) {
    if (this.isModified("totalAmount")) {
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
    }
    next();
});
export const Order = mongoose.model("Order", orderSchema);
