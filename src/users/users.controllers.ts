import { NextFunction, Request, Response } from "express";
import {
  getMeFromDb,
  loginUserDB,
  registerUserIntoDb,
  updatePasswordIntoDb,
} from "./users.services.js";
import { sendSuccess } from "../error_success/customSuccess.js";
import { sendError } from "../error_success/customError.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await registerUserIntoDb(req.body);
    sendSuccess("User registered successfully!", 200, data, res);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implement login logic here
    const { email, password } = req.body;
    const loggedInUser = await loginUserDB(email, password);
    sendSuccess("User logged in successfully!", 200, loggedInUser, res);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;
  if (!token) {
    return sendError(new Error("Token is required"), 401, res);
  }

  let _id: string | undefined;
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { _id: string };
    _id = decodedToken._id;
  } catch (error) {
    next(error);
  }

  try {
    const updatedUser = await updatePasswordIntoDb(
      _id as string,
      oldPassword,
      newPassword
    );
    sendSuccess("Password updated successfully!", 200, updatedUser, res);
  } catch (error: any) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token as string;
  const { _id } = jwtDecode(token) as { _id: string };

  try {
    const user = await getMeFromDb(_id as string);
    sendSuccess("User details fetched successfully!", 200, user, res);
  } catch (error: any) {
    next(error);
  }
};

export const userController = {
  registerUser,
  loginUser,
  updatePassword,
  getMe,
};
