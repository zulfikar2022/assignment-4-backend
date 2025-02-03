import { Router } from "express";
import { loginUserValidation, registerUserValidation, updatePasswordValidation, } from "./users.validations.js";
import { userController } from "./users.controllers.js";
import { auth, Roles } from "../middlewares/authentication.middleware.js";
const userRoutes = Router();
// register user
userRoutes.post("/register", (req, res, next) => {
    try {
        registerUserValidation.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
}, userController.registerUser);
// login user
userRoutes.post("/login", (req, res, next) => {
    try {
        loginUserValidation.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
}, userController.loginUser);
// route for updating users password
userRoutes.put("/update-password", (req, res, next) => {
    try {
        updatePasswordValidation.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
}, auth([Roles.ADMIN, Roles.CUSTOMER]), userController.updatePassword);
// route for getting me
userRoutes.get("/me", auth([Roles.ADMIN, Roles.CUSTOMER]), userController.getMe);
// route for updating users password
export { userRoutes };
