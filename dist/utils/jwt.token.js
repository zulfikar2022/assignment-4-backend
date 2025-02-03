// generating a token based on given data
import jwt from "jsonwebtoken";
import { environmentVariables } from "../configurations/env.config.js";
import { jwtDecode } from "jwt-decode";
const expiresIn = environmentVariables.JWT_EXPIRY;
export const generateToken = (data) => {
    return jwt.sign(data, environmentVariables.JWT_SECRET, {
        expiresIn,
    });
};
export const decodeToken = (token) => {
    return jwtDecode(token);
};
