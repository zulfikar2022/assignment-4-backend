import { ObjectId } from "mongoose";

export type TTokenPayload = {
  email: string;
  name: string;
  _id: ObjectId;
  role: "admin" | "customer";
  iat: number;
  exp: number;
};
