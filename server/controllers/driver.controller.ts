require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { sendToken } from "../utils/send-token";
import { nylas } from "../app";
import { Prisma } from '@prisma/client';

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
    // Ensure `ids` is properly typed as a string from `req.query`
    const { ids } = req.query as { ids?: string };

    console.log(ids, "ids");
    
    if (!ids) {
      return res.status(400).json({ message: "No driver IDs provided" });
    }

    // Convert the comma-separated `ids` string to an array of integers
    const driverIds = ids.split(",").map(id => parseInt(id, 10));

    // Fetch drivers from the database
    const drivers = await prisma.driver.findMany({
      where: {
        id: { in: driverIds }, // Use the `in` operator for the query
      },
    });

    res.json(drivers);
  } catch (error) {
    console.error("Error fetching driver data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const savePushToken = async (req: any, res: Response) => {
  const { pushToken } = req.body;
  const driverId = req.driverId; // Assuming driver ID is extracted from the JWT or session middleware
  console.log("Driver ID",driverId)
  if (!pushToken) {
    return res.status(400).json({ error: 'Push token is required' });
  }

  try {
    // Update or create the push token for the driver
    await prisma.driver.update({
      where: { id: driverId },
      data: { notificationToken:pushToken },
    });

    return res.status(200).json({ message: 'Push token saved successfully' });
  } catch (error) {
    console.error('Error saving push token:', error);
 // Narrow the error type
 if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Driver not found' });
  }
}

console.error('Error saving push token:', error);
return res.status(500).json({ error: 'Failed to save push token' });
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
const verificationCodes: { [key: string]: string } = {};
import * as querystring from 'querystring';
import * as http from 'http';

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { contact }: { contact: string } = req.body;
const phone_number = contact
  try {
    const driver = await prisma.driver.findUnique({
      where: { phone_number },
    });

    if (!driver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[phone_number] = verificationCode;

    return res.json({ success: true, verificationCode });
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ success: false, message: 'Error processing request' });
  }
};

// Send SMS Endpoint
export const sendSms = (req: Request, res: Response): void => {
  let { recipient, message }: { recipient: string, message: string } = req.body;

  // Ensure recipient number starts with '92' (Pakistan country code)
  if (!recipient.startsWith('92')) {
      recipient = `92${recipient.replace(/^0+/, '')}`;
  }

  const params = querystring.stringify({
      id: 'rchgulbergisb',
      pass: 'window2008',
      msg: message,
      to: recipient,
      mask: 'IBECHS',
      type: 'xml',
      lang: 'English',
  });

  const options = {
      hostname: 'www.outreach.pk',
      path: '/api/sendsms.php/sendsms/url',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(params),
      },
  };

  const smsReq = http.request(options, (smsRes) => {
      let responseData = '';

      smsRes.on('data', (chunk) => {
          responseData += chunk;
      });

      smsRes.on('end', () => {
          console.log("SMS Gateway Response:", responseData);
          return res.json({ success: true, message: 'SMS sent successfully', gatewayResponse: responseData });
      });
  });

  smsReq.on('error', (e) => {
      console.error("Error sending SMS:", e);
      return res.status(500).json({ success: false, message: 'Failed to send SMS', error: e.message });
  });

  smsReq.write(params);
  smsReq.end();
};

// Reset Password Endpoint
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { contact, newPassword, otp }: { contact: string, newPassword: string, otp: string } = req.body;
const phone_number = contact;
const password = newPassword;
const verificationCode = otp;


  if (!verificationCodes[phone_number] || verificationCodes[phone_number] !== verificationCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.driver.update({
      where: { phone_number },
      data: { password: hashedPassword },
    });

    // Delete the verification code after successful password reset
    delete verificationCodes[phone_number];
    
    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: 'Error processing password reset' });
  }
};

declare global {
  namespace Express {
    interface Request {
      driver: any; // You can replace `any` with a more specific driver type
    }
  }
}

export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driverId = req.driver.id;  // Get driver ID from req.driver
    const updatedData = req.body;

    // Validate input
    if (!driverId || typeof driverId !== 'number') {
      return res.status(400).json({ message: "Valid Driver ID is required" });
    }

    // Update the driver using Prisma's `update` method
    const driver = await prisma.driver.update({
      where: { id: driverId },  // Pass `id` inside an object
      data: updatedData,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver updated successfully", driver });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Error updating driver data", error });
  }
};


export const getEvents = async (req: Request, res: Response) => {
  try {
    // Fetch all events from the database
    const events = await prisma.event.findMany();

    // Map the events to match the frontend's expected structure
    const formattedEvents = events.map((event) => ({
      id: event.id.toString(),
      title: `Event ${event.id}`,
      date: event.eventDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      description: event.description,
      from: { lat: event.fromLat, lng: event.fromLng },
      destination: { lat: event.destinationLat, lng: event.destinationLng },
      bid: event.bid,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Create a new shared ride
export const createSharedRide = async (req: Request, res: Response) => {
  try {
    const {
      from,
      fromLat,
      fromLng,
      destination,
      destinationLat,
      destinationLng,
      date,
      time,
      bid,
      carType,
      numberOfSeats,
      availableSeats,
    } = req.body;

    // Validate required fields
    if (
      !from ||
      !fromLat ||
      !fromLng ||
      !destination ||
      !destinationLat ||
      !destinationLng ||
      !date ||
      !time ||
      !bid ||
      !carType ||
      !numberOfSeats ||
      !availableSeats
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the shared ride in the database
    const newRide = await prisma.sharedRide.create({
      data: {
        from,
        fromLat,
        fromLng,
        destination,
        destinationLat,
        destinationLng,
        Date: new Date(date),
        Time: time,
        Bid: parseFloat(bid),
        carType,
        numberOfSeats: parseInt(numberOfSeats),
        AvaliableSeats: parseInt(availableSeats),
      },
    });

    res.status(201).json(newRide);
  } catch (error) {
    console.error("Error creating shared ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all shared rides
export const getSharedRides = async (req: Request, res: Response) => {
  try {
    const rides = await prisma.sharedRide.findMany();
    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching shared rides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a shared ride
export const updateSharedRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      from,
      fromLat,
      fromLng,
      destination,
      destinationLat,
      destinationLng,
      date,
      time,
      bid,
      carType,
      numberOfSeats,
      availableSeats,
    } = req.body;

    // Validate required fields
    if (
      !from ||
      !fromLat ||
      !fromLng ||
      !destination ||
      !destinationLat ||
      !destinationLng ||
      !date ||
      !time ||
      !bid ||
      !carType ||
      !numberOfSeats ||
      !availableSeats
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update the shared ride in the database
    const updatedRide = await prisma.sharedRide.update({
      where: { id: parseInt(id) },
      data: {
        from,
        fromLat,
        fromLng,
        destination,
        destinationLat,
        destinationLng,
        Date: new Date(date),
        Time: time,
        Bid: parseFloat(bid),
        carType,
        numberOfSeats: parseInt(numberOfSeats),
        AvaliableSeats: parseInt(availableSeats),
      },
    });

    res.status(200).json(updatedRide);
  } catch (error) {
    console.error("Error updating shared ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a shared ride
export const deleteSharedRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the shared ride from the database
    await prisma.sharedRide.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting shared ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
