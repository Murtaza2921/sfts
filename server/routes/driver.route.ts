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
  driverLoin,
  savePushToken,
  forgotPassword,
  resetPassword,
  sendSms,
  //verifyPhoneOtpForRegistration,
} from "../controllers/driver.controller";
import { isAuthenticatedDriver } from "../middleware/isAuthenticated";

const driverRouter = express.Router();

driverRouter.post("/register", register);


driverRouter.post("/login", driverLoin);

//driverRouter.post("/verify-otp", verifyPhoneOtpForRegistration);

//driverRouter.post("/registration-driver", verifyingEmailOtp);

driverRouter.get("/me", isAuthenticatedDriver, getLoggedInDriverData);

driverRouter.get("/get-drivers-data", getDriversById);

driverRouter.put("/update-status", isAuthenticatedDriver, updateDriverStatus);
driverRouter.post("/save-push-token",isAuthenticatedDriver,savePushToken);

driverRouter.post("/new-ride", isAuthenticatedDriver, newRide);

driverRouter.post("/forget-password", forgotPassword)
driverRouter.post("/sendSms", sendSms)
driverRouter.post("/resetPassword", resetPassword)



driverRouter.put(
  "/update-ride-status",
  isAuthenticatedDriver,
  updatingRideStatus
);

driverRouter.get("/get-rides", isAuthenticatedDriver, getAllRides);

export default driverRouter;
