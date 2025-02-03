import { ShurjoPay } from "shurjopay";
import { environmentVariables } from "../configurations/env.config.js";
const shurjopay = new ShurjoPay({
    api_url: environmentVariables.SP_ENDPOINT,
    username: environmentVariables.SP_USERNAME,
    password: environmentVariables.SP_PASSWORD,
    prefix: environmentVariables.SP_PREFIX,
});
