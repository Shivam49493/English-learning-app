import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getMessages, postMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/", isAuth, getMessages);
messageRouter.post("/", isAuth, postMessage);

export default messageRouter;
