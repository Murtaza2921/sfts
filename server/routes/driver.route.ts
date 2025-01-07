import express from "express";
import {
  getAllRides,
  getDriversById,
  getLoggedInDriverData,
  newRide,
  register,
  updateDriverStatus,
  updatingRideStatus,
 // verifyingEmailOtp,
  driverLogin,
  updateDriver,
  //verifyPhoneOtpForRegistration,
} from "../controllers/driver.controller";
import { isAuthenticatedDriver } from "../middleware/isAuthenticated";

const driverRouter = express.Router();

driverRouter.post("/register", register);

driverRouter.post("/login", driverLogin);

//driverRouter.post("/verify-otp", verifyPhoneOtpForRegistration);

//driverRouter.post("/registration-driver", verifyingEmailOtp);

driverRouter.get("/me", isAuthenticatedDriver, getLoggedInDriverData);

driverRouter.put("/me", isAuthenticatedDriver, updateDriver);

driverRouter.get("/get-drivers-data", getDriversById);

driverRouter.put("/update-status", isAuthenticatedDriver, updateDriverStatus);

driverRouter.post("/new-ride", isAuthenticatedDriver, newRide);

driverRouter.put(
  "/update-ride-status",
  isAuthenticatedDriver,
  updatingRideStatus
);

driverRouter.get("/get-rides", isAuthenticatedDriver, getAllRides);

export default driverRouter;
