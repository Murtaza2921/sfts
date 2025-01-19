require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { nylas } from "../app";
import { Prisma } from '@prisma/client';
import { sendToken } from "../utils/send-token";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const bcrypt = require('bcrypt');
const client = twilio(accountSid, authToken, {
  lazyLoading: true,
});


export const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone_number, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !phone_number || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Check if user already exists by email or phone number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone_number }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number.",
      });
    }

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        phone_number,
        email,
        password: await bcrypt.hash(password, 10), // You can set a default password, or handle password setup later
      },
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id },
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
};


// get logged in user data

export const getLoggedInUserData = async (req: any, res: Response) => {
  try {
    const user = req.user;

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveUserToken = async (req: any, res: Response) => {
  const { pushToken } = req.body;
  const userID = req.userId; // Assuming user ID is extracted from the JWT or session middleware
  console.log("User ID",userID)
  if (!pushToken) {
    return res.status(400).json({ error: 'Push token is required' });
  }

  try {
    // Update or create the push token for the user
    await prisma.user.update({
      where: { id: userID },
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
// getting user rides
export const getAllRides = async (req: any, res: Response) => {
  const rides = await prisma.rides.findMany({
    where: {
      userId: req.user?.id,
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


export const loginUser = async (
  req: Request,
  res: Response,
 
) => {
  try {
    const { email, phone_number , password } = req.body;

    if ((!email && !phone_number) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide contact and password.",
      });
    }

   // Create query object based on the provided contact information
   const query = email ? { email } : { phone_number };

   // Find user based on the provided contact (either email or phone number)
   const user = await prisma.user.findUnique({
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



const verificationCodes: { [key: string]: string } = {};
import * as querystring from 'querystring';
import * as http from 'http';

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { contact }: { contact: string } = req.body;
const phone_number = contact
  try {
    const user = await prisma.user.findUnique({
      where: { phone_number },
    });

    if (!user) {
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

    const updatedUser = await prisma.user.update({
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
