import { Response } from "express";
import { environmentVariables } from "../configurations/env.config.js";

export type TError = {
  message?: string;
  statusCode?: number;
  stack?: string;
};

export const sendError = (error: TError, statusCode: number, res: Response) => {
  res.status(statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "Internal Server Error",
      statusCode: statusCode || 500,
      stack:
        environmentVariables.NODE_ENV === "development" ? error?.stack : null,
    },
  });
};

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  toString() {
    return this.message;
  }
}
