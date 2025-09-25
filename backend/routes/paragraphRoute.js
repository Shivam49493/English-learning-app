import express from "express";
import { getParagraphs } from "../controllers/paraController.js";
const paragraphRouter = express.Router();
paragraphRouter.get("/getparagraphs", getParagraphs);
export default paragraphRouter;