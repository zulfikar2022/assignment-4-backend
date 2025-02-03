import express, { NextFunction, Request, Response } from "express";
import router from "./routes.js";
import { StatusCodes } from "http-status-codes";
import { sendError } from "./error_success/customError.js";
import cors from "cors";

export const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/v1", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  sendError(err, err.statusCode, res);
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: StatusCodes.NOT_FOUND,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
