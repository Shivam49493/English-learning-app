import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {getCurrentUser, updateUserProgress} from "../controllers/userController.js"



const userRouter = express.Router();
userRouter.get("/getcurrentuser", isAuth, getCurrentUser);
userRouter.post("/progress", isAuth, updateUserProgress);

export default userRouter;