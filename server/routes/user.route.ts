import express from "express";
import {
  getAllRides,
  getLoggedInUserData,
  registration,
  loginUser
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.post("/register", registration);


userRouter.get("/me", isAuthenticated, getLoggedInUserData);
//,
userRouter.get("/get-rides", isAuthenticated, getAllRides);

export default userRouter;
