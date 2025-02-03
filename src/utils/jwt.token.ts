// generating a token based on given data
import jwt from "jsonwebtoken";
import { TUser } from "../users/users.types.js";
import { environmentVariables } from "../configurations/env.config.js";
import { jwtDecode } from "jwt-decode";

const expiresIn = environmentVariables.JWT_EXPIRY as string | number;
export const generateToken = (
  data: Pick<TUser, "name" | "_id" | "role" | "email">
) => {
  return jwt.sign(data, environmentVariables.JWT_SECRET as string, {
    expiresIn,
  });
};

export const decodeToken = (token: string) => {
  return jwtDecode(token);
};
