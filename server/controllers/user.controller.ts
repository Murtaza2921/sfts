require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { nylas } from "../app";
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
    const { name, phone_number, email,password } = req.body; // Receive name, phone, and email

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
