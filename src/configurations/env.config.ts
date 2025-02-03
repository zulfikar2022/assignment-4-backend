import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const environmentVariables = {
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,

  SP_ENDPOINT: process.env.SP_ENDPOINT,
  SP_USERNAME: process.env.SP_USERNAME,
  SP_PASSWORD: process.env.SP_PASSWORD,
  SP_PREFIX: process.env.SP_PREFIX,
  SP_RETURN_URL: process.env.SP_RETURN_URL,
  DB_FILE: process.env.DB_FILE,
};
