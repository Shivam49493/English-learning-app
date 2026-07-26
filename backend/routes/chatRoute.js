import express from "express";
import { handleChatQuery } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", handleChatQuery);

export default chatRouter;
