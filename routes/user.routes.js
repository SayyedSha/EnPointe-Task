import { Router } from "express";
import { getAllUser, getCurrentUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { beforeLogin, verifyJWT } from "../middelwares/auth.middelware.js";
const userRouter = Router();

userRouter.route("/register").post(beforeLogin,registerUser);
userRouter.route("/login").post(beforeLogin,loginUser)
userRouter.route("/getcurrentuserdetail").get(verifyJWT,getCurrentUser);
userRouter.route("/getAlluser").get(verifyJWT,getAllUser)

export default userRouter
