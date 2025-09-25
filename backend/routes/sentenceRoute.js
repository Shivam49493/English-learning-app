
import express from "express";
import { getSentence } from "../controllers/sentenceController.js";

const sentenceRouter = express.Router();
sentenceRouter.get("/getsentences", getSentence);

export default sentenceRouter;