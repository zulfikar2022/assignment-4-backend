import { model, Schema } from "mongoose";
import { environmentVariables } from "../configurations/env.config.js";
import bcrypt from "bcrypt";
import { CustomError } from "../error_success/customError.js";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    isDeactivated: { type: Boolean, default: false },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    // hash the password here
    try {
        const salt_rounds = Number(environmentVariables.SALT_ROUNDS);
        user.password = await bcrypt.hash(user.password, salt_rounds);
        next();
    }
    catch (error) {
        const err = new CustomError(error?.message, 500);
        next(err);
    }
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
export const User = model("User", userSchema);
