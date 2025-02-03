import express from "express";
import Shurjopay from "shurjopay";
import { environmentVariables } from "../configurations/env.config.js";
import { paymentControllers } from "./payment.controllers.js";
const paymentRoutes = express.Router();
export const shurjopay = new Shurjopay();
shurjopay.config(environmentVariables.SP_ENDPOINT, environmentVariables.SP_USERNAME, environmentVariables.SP_PASSWORD, environmentVariables.SP_PREFIX, environmentVariables.SP_RETURN_URL);
// shurjopay.makePayment();
paymentRoutes.post("/checkout", paymentControllers.makePayment);
paymentRoutes.get("/verify-payment", paymentControllers.verifyPayment);
// payment maker utility function
export default paymentRoutes;
