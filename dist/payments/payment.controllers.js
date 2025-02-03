import { jwtDecode } from "jwt-decode";
import { User } from "../users/users.model.js";
import { sendSuccess } from "../error_success/customSuccess.js";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../error_success/customError.js";
import Shurjopay from "shurjopay";
import { environmentVariables } from "../configurations/env.config.js";
import { shurjopay } from "./payments.routes.js";
import { Order } from "../orders/orders.model.js";
const makePayment = async (req, res) => {
    try {
        const order = req.body;
        const token = req.headers.token;
        const { _id: customerId } = jwtDecode(token);
        const customer = (await User.findById(customerId));
        const shurjopayPayload = {
            amount: order.totalAmount,
            order_id: order._id,
            currency: "BDT",
            customer_name: customer.name,
            customer_address: order.shippingAddress,
            client_ip: req.ip,
            customer_email: customer.email,
            customer_phone: "N/A",
            customer_city: "N/A",
        };
        const shurjopay = new Shurjopay();
        shurjopay.config(environmentVariables.SP_ENDPOINT, environmentVariables.SP_USERNAME, environmentVariables.SP_PASSWORD, environmentVariables.SP_PREFIX, environmentVariables.SP_RETURN_URL);
        shurjopay.makePayment(shurjopayPayload, (response_data) => {
            sendSuccess("Payment successful", StatusCodes.ACCEPTED, response_data, res);
        }, (error) => {
            // TODO Handle error response
            sendError(new Error(error), StatusCodes.BAD_REQUEST, res);
        });
    }
    catch (error) {
        sendError(new Error(error.message), StatusCodes.INTERNAL_SERVER_ERROR, res);
    }
};
const verifyPayment = async (req, res) => {
    const { order_id } = req.query;
    console.log("Inside verifyPayment");
    console.log(order_id);
    shurjopay.verifyPayment(order_id, async (response_data) => {
        // sendSuccess("Payment verified", StatusCodes.OK, response_data, res);
        console.log("Response data: ", response_data);
        if (response_data[0].bank_status === "Success") {
            try {
                const customer_order_id = response_data[0].customer_order_id;
                const updatedData = await Order.findByIdAndUpdate(customer_order_id, { isPaid: true }, { new: true });
            }
            catch (error) {
                console.log("Error happened while updating customers payment status");
            }
            finally {
                res.redirect("https://coruscating-bonbon-3879b6.netlify.app/successful-payment");
            }
        }
        else {
            res.redirect("https://coruscating-bonbon-3879b6.netlify.app/failed-payment");
        }
    }, (error) => { });
};
export const paymentControllers = {
    makePayment,
    verifyPayment,
};
