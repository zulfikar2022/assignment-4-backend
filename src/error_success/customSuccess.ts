import { Response } from "express";

export const sendSuccess = (
  message: string,
  statusCode: number,
  data: any,
  res: Response
) => {
  res.status(statusCode).json({
    message,
    statusCode,
    data,
    success: true,
  });
};
