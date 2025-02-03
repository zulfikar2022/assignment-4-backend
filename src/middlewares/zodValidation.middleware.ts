import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
