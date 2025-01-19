import express from "express";
import {
  getAllRides,
  getLoggedInUserData,
  registration,
  loginUser,
  addfamilyEvent,
  getUpcomingEvents,
  deleteEvent,
  editEvent,
  getSharedRides,
  saveUserToken,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.post("/register", registration);

userRouter.delete("/deleteEvent/:id", deleteEvent);


userRouter.post("/addfamilyEvent", addfamilyEvent);
userRouter.get("/getUpcomingEvents", getUpcomingEvents);

userRouter.put("/editEvent/:id", editEvent);


userRouter.get("/me", isAuthenticated, getLoggedInUserData);
userRouter.post("/save-push-token-user", isAuthenticated, saveUserToken);

userRouter.get("/get-rides", isAuthenticated, getAllRides);


userRouter.post("/forget-password", forgotPassword)
userRouter.post("/sendSms", sendSms)
userRouter.post("/resetPassword", resetPassword)


export default userRouter;
