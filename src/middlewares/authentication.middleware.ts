import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { environmentVariables } from "../configurations/env.config.js";
import { CustomError } from "../error_success/customError.js";
import { StatusCodes } from "http-status-codes";

export enum Roles {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export const auth = (roles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.headers;
    if (!token) {
      const error = new CustomError(
        "Token is required",
        StatusCodes.UNAUTHORIZED
      );
      next(error);
    }

    try {
      if (typeof token === "string") {
        const decoded = jwt.verify(
          token,
          environmentVariables.JWT_SECRET as string
        );
        const { role } = decoded as jwt.JwtPayload;
        if (role && roles.includes(role)) {
          next();
        } else {
          const error = new CustomError(
            "Unauthorized User",
            StatusCodes.FORBIDDEN
          );
          next(error);
        }
      } else {
        const error = new CustomError(
          "Invalid token format",
          StatusCodes.UNAUTHORIZED
        );
        next(error);
      }
    } catch (error) {
      const customError = new CustomError(
        "Invalid token",
        StatusCodes.UNAUTHORIZED
      );
      next(customError);
    }
  };
};
