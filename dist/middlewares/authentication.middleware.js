import jwt from "jsonwebtoken";
import { environmentVariables } from "../configurations/env.config.js";
import { CustomError } from "../error_success/customError.js";
import { StatusCodes } from "http-status-codes";
export var Roles;
(function (Roles) {
    Roles["ADMIN"] = "admin";
    Roles["CUSTOMER"] = "customer";
})(Roles || (Roles = {}));
export const auth = (roles) => {
    return (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            const error = new CustomError("Token is required", StatusCodes.UNAUTHORIZED);
            next(error);
        }
        try {
            if (typeof token === "string") {
                const decoded = jwt.verify(token, environmentVariables.JWT_SECRET);
                const { role } = decoded;
                if (role && roles.includes(role)) {
                    next();
                }
                else {
                    const error = new CustomError("Unauthorized User", StatusCodes.FORBIDDEN);
                    next(error);
                }
            }
            else {
                const error = new CustomError("Invalid token format", StatusCodes.UNAUTHORIZED);
                next(error);
            }
        }
        catch (error) {
            const customError = new CustomError("Invalid token", StatusCodes.UNAUTHORIZED);
            next(customError);
        }
    };
};
