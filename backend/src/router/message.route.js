import { Router } from "express";
import { AddMessage, GetMessages } from "../controllers/message.controller.js";
import { UserVerify } from "../middlewares/auth.middleware.js";

const MessageRouter = Router();

MessageRouter.route("/add").post(
    UserVerify,
    AddMessage
);

MessageRouter.route("/get").get(
    UserVerify,
    GetMessages
);

export default MessageRouter;