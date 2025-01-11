import express from "express";
import {
  getAllRides,
  getLoggedInUserData,
  registration,
  loginUser,
  saveUserToken
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.post("/register", registration);


userRouter.get("/me", isAuthenticated, getLoggedInUserData);
userRouter.post("/save-push-token-user", isAuthenticated, saveUserToken);
//,
userRouter.get("/get-rides", isAuthenticated, getAllRides);

export default userRouter;
