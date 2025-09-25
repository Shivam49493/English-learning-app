import express from "express";

import { getCommonWords,matchWords,getQuizWord ,getQuizOptions} from "../controllers/wordController.js";



const wordRouter = express.Router();
wordRouter.get("/common",getCommonWords );
wordRouter.post("/match",matchWords );
wordRouter.get("/quiz", getQuizWord );
wordRouter.get("/options", getQuizOptions );
export default wordRouter;
