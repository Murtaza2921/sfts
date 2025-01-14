import express from "express";
import {
  getAllRides,
  getLoggedInUserData,
  registration,
  loginUser,
  addfamilyEvent,
  getUpcomingEvents,
  deleteEvent,
  editEvent
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
//,
userRouter.get("/get-rides", isAuthenticated, getAllRides);

export default userRouter;
