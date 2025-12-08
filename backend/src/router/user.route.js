import { Router } from "express";
import { RegisterUser, LoginUser, CheckLogin, UserLogout } from "../controllers/user.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const UserRouter = Router();
UserRouter.route("/register").post( 
    RegisterUser
);
UserRouter.route("/login").post(
    LoginUser
);
UserRouter.route("/checklogin").get(
    UserVerify,
    CheckLogin
);
UserRouter.route("/logout").post(
    UserVerify, 
    UserLogout
);

export default UserRouter;