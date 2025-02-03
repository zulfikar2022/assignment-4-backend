import { environmentVariables } from "../configurations/env.config.js";
export const sendError = (error, statusCode, res) => {
    res.status(statusCode || 500).json({
        success: false,
        error: {
            message: error.message || "Internal Server Error",
            statusCode: statusCode || 500,
            stack: environmentVariables.NODE_ENV === "development" ? error?.stack : null,
        },
    });
};
export class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    toString() {
        return this.message;
    }
}
