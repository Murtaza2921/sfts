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
//,
userRouter.get("/get-rides", isAuthenticated, getAllRides);

userRouter.get('/shared-rides', getSharedRides);

export default userRouter;
