require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { sendToken } from "../utils/send-token";
import { nylas } from "../app";
const bcrypt = require('bcrypt');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// sending otp to driver phone number
// export const sendingOtpToPhone = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { phone_number } = req.body;
//     console.log(phone_number);

//     // Mocking the Twilio API call
//     try {
//       // Simulating a successful Twilio response
//       // You can mock a failure by changing the condition later if needed
//       const mockTwilioResponse = { success: true };

//       if (mockTwilioResponse.success) {
//         // Simulate successful response from Twilio API
//         res.status(201).json({
//           success: true,
//           message: 'OTP sent successfully (mocked)',
//         });
//       } else {
//         // Simulate an error response from Twilio
//         throw new Error('Twilio API call failed');
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({
//         success: false,
//         message: 'Failed to send OTP (mocked)',
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       success: false,
//       message: 'Unexpected error occurred',
//     });
//   }
// };


// export const sendingOtpToEmail = async (req: Request) => {
//   try {
//     const {
//       name,
//       country,
//       phone_number,
//       email,
//       vehicle_type,
//       registration_number,
//       registration_date,
//       driving_license,
//       vehicle_color,
//       rate,
//     } = req.body;

//     const otp = "1234";
//     const driver = {
//       name,
//       country,
//       phone_number,
//       email,
//       vehicle_type,
//       registration_number,
//       registration_date,
//       driving_license,
//       vehicle_color,
//       rate,
//     };

//     const token = jwt.sign(
//       {
//         driver,
//         otp,
//       },
//       process.env.EMAIL_ACTIVATION_SECRET!,
//       {
//         expiresIn: "5m",
//       }
//     );

//     // Mocking email sending
//     console.log(`Email not sent. OTP for ${name} is: ${otp}`);

//     return {
//       success: true,
//       token,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to send OTP to email");
//   }
// };



// export const verifyPhoneOtpForRegistration = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { phone_number, otp } = req.body;

//     console.log(
//       `Verifying OTP for phone number: ${phone_number} with OTP: ${otp}`
//     );

//     // Mock Twilio OTP verification
//     const mockTwilioResponse = { success: true }; // Simulate a successful response

//     if (mockTwilioResponse.success) {
//       console.log("Phone OTP verified successfully (mocked)");

//       try {
//         const emailOtpResponse = await sendingOtpToEmail(req);
//         console.log("token : ", emailOtpResponse.token)
//         res.status(200).json({
//           success: true,
//           message: "Phone OTP verified successfully, moving to email OTP process.",
//           emailToken: emailOtpResponse.token,
//         });
//       } catch (error) {
//         res.status(500).json({
//           success: false,
//           message: error,
//         });
//       }
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Unexpected error during phone OTP verification.",
//     });
//   }
// };

 
// export const verifyingEmailOtp = async (req: Request, res: Response) => {
//   try {
//     const { otp, token } = req.body;

//     // Decode and verify the token
//     const newDriver: any = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET!
//     );

//     // if (newDriver.otp !== otp) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "OTP is not correct or expired!",
//     //   });
//     // }

//     const {
//       name,
//       country,
//       phone_number,
//       password,
//       email,
//       vehicle_type,
//       registration_number,
//       registration_date,
//       driving_license,
//       vehicle_color,
//       rate,
//     } = newDriver.driver;

//     // Check if the email or phone number already exists
//     const existingDriver = await prisma.driver.findFirst({
//       where: {
//         OR: [
//           { email },
//           { phone_number },
//         ],
//       },
//     });

//     if (existingDriver) {
//       const conflictField =
//         existingDriver.email === email ? "email" : "phone number";
//       return res.status(400).json({
//         success: false,
//         message: `A driver with this ${conflictField} already exists.`,
//       });
//     }

//     // Create a new driver if no conflicts
//     const driver = await prisma.driver.create({
//       data: {
//         name,
//         country,
//         phone_number,
//         password : await bcrypt.hash(password, 10),
//         email,
//         vehicle_type,
//         registration_number,
//         registration_date,
//         driving_license,
//         vehicle_color,
//         rate,
//       },
//     });

//     // Send token for the newly created driver
//     sendToken(driver, res);
//   } catch (error: any) {
//     console.error(error);

//     if (error.code === "P2002") {
//       // Unique constraint violation occurred
//       const conflictingField = error.meta?.target.replace("driver_", ""); // Prisma provides the field causing the error
//       return res.status(400).json({
//         success: false,
//         message: `A driver with this ${conflictingField} already exists.`,
//       });
//     }

//     // Handle other unexpected errors
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred. Please try again.",
//     });
//   }
// };



export const getLoggedInDriverData = async (req: any, res: Response) => {
  try {
    const driver = req.driver;

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
  }
};

// updating driver status
export const updateDriverStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;

    const driver = await prisma.driver.update({
      where: {
        id: req.driver.id!,
      },
      data: {
        status,
      },
    });
    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get drivers data with id
export const getDriversById = async (req: Request, res: Response) => {
  try {
    const { ids } = req.query as any;
    console.log(ids,'ids')
    if (!ids) {
      return res.status(400).json({ message: "No driver IDs provided" });
    }

    const driverIds = ids.split(",");

    // Fetch drivers from database
    const drivers = await prisma.driver.findMany({
      where: {
        id: 1,
        // id: { in: driverIds },
      },
    });

    res.json(drivers);
  } catch (error) {
    console.error("Error fetching driver data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// creating new ride
export const newRide = async (req: any, res: Response) => {
  try {
    const {
      userId,
      charge,
      status,
      currentLocationName,
      destinationLocationName,
      distance,
    } = req.body;

    const newRide = await prisma.rides.create({
      data: {
        userId,
        driverId: req.driver.id,
        charge: parseFloat(charge),
        status,
        currentLocationName,
        destinationLocationName,
        distance,
      },
    });
    res.status(201).json({ success: true, newRide });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// updating ride status
export const updatingRideStatus = async (req: any, res: Response) => {
  try {
    const { rideId, rideStatus } = req.body;

    // Validate input
    if (!rideId || !rideStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const driverId = req.driver?.id;
    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch the ride data to get the rideCharge
    const ride = await prisma.rides.findUnique({
      where: {
        id: rideId,
      },
    });

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    const rideCharge = ride.charge;

    // Update ride status
    const updatedRide = await prisma.rides.update({
      where: {
        id: rideId,
        driverId,
      },
      data: {
        status: rideStatus,
      },
    });

    if (rideStatus === "Completed") {
      // Update driver stats if the ride is completed
      await prisma.driver.update({
        where: {
          id: driverId,
        },
        data: {
          totalEarning: {
            increment: rideCharge,
          },
          totalRides: {
            increment: 1,
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      updatedRide,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// getting drivers rides
export const getAllRides = async (req: any, res: Response) => {
  const rides = await prisma.rides.findMany({
    where: {
      driverId: req.driver?.id,
    },
    include: {
      driver: true,
      user: true,
    },
  });
  res.status(201).json({
    rides,
  });
};

export const driverLoin = async (
  req: Request,
  res: Response,
 
) => {
  try {
    const { email, phonenumber , password } = req.body;

    if ((!email && !phonenumber) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide contact and password.",
      });
    }
const phone_number = phonenumber
  // Create query object based on the provided contact information
  const query = email ? { email } : { phone_number };

  // Find user based on the provided contact (either email or phone number)
  const user = await prisma.driver.findUnique({
    where: query,
  });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up first.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // Send access token
    await sendToken(user, res);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      country,
      phone_number,
      email,
      password,
      vehicle_type,
      registration_number,
      registration_date,
      driving_license,
      vehicle_color,
      rate,
    } = req.body.driver; // Extract fields from req.body.driver

    // Validate required fields
    if (
      !name ||
      !country ||
      !phone_number ||
      !email ||
      !password ||
      !vehicle_type ||
      !registration_number ||
      !registration_date ||
      !driving_license ||
      rate === undefined
    ) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Validate vehicle_type
    const validVehicleTypes = ['Car', 'TRUCK', 'MOTORCYCLE', 'VAN', 'BUS'];
    if (!validVehicleTypes.includes(vehicle_type)) {
      return res.status(400).json({ message: `Invalid vehicle_type. Must be one of: ${validVehicleTypes.join(', ')}` });
    }

    // Check if the driver already exists
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [
          { email },
          // { phone_number },
          // { registration_number },
          // { driving_license },
        ],
      },
    });

    if (existingDriver) {
      return res.status(409).json({ message: 'Driver already exists.' });
    }

    // Create new driver
    const newDriver = await prisma.driver.create({
      data: {
        name,
        country,
        phone_number,
        email,
        password :  await bcrypt.hash(password, 10),
        vehicle_type,
        registration_number,
        registration_date,
        driving_license,
        vehicle_color,
        rate,
      },
    });

  const token = jwt.sign(
         { id: newDriver.id },
         process.env.ACCESS_TOKEN_SECRET!,
         {
           expiresIn: "30d",
         }
       );
      
  
      // Send token in the response (you can also redirect to the home screen after registration)
      res.status(201).json({
        success: true,
        message: "Registration successful.",
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
