import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {getCurrentUser} from "../controllers/userController.js"



const userRouter = express.Router();
userRouter.get("/getcurrentuser", isAuth, getCurrentUser);

export default userRouter;