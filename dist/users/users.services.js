import { StatusCodes } from "http-status-codes";
import { CustomError } from "../error_success/customError.js";
import { User } from "./users.model.js";
import { generateToken } from "../utils/jwt.token.js";
const registerUserIntoDb = async (user) => {
    try {
        const { email } = user;
        if (await User.findOne({ email })) {
            throw new Error("User already exists");
        }
        const newUser = new User(user);
        const data = await newUser.save();
        return { ...data?.toObject(), password: "" };
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.CONFLICT);
        throw err;
    }
};
const loginUserDB = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }
        if (user.isDeactivated) {
            throw new CustomError("User is deactivated", StatusCodes.FORBIDDEN);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new CustomError("Invalid Login Credentials", StatusCodes.UNAUTHORIZED);
        }
        const token = generateToken({
            email,
            name: user.name,
            _id: user._id,
            role: user.role,
        });
        return { ...user?.toObject(), password: "", token };
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.UNAUTHORIZED);
        throw err;
    }
};
const updatePasswordIntoDb = async (_id, oldPassword, newPassword) => {
    try {
        const user = await User.findOne({ _id }).select("+password");
        if (!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }
        const isMatch = await user.comparePassword(oldPassword);
        console.log({ isMatch });
        if (!isMatch) {
            throw new CustomError("Invalid Old Password", StatusCodes.UNAUTHORIZED);
        }
        user.password = newPassword;
        const updateUser = await user.save();
        return { ...updateUser?.toObject(), password: "" };
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.UNAUTHORIZED);
        throw err;
    }
};
const getMeFromDb = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }
        return user;
    }
    catch (error) {
        const err = new CustomError(error?.message, StatusCodes.UNAUTHORIZED);
        throw err;
    }
};
export { registerUserIntoDb, loginUserDB, updatePasswordIntoDb, getMeFromDb };
