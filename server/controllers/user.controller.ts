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

export const saveUserToken = async (req: any, res: Response) => {
  const { pushToken } = req.body;
  const userID = req.userId; // Assuming driver ID is extracted from the JWT or session middleware
  console.log("User ID",userID)
  if (!pushToken) {
    return res.status(400).json({ error: 'Push token is required' });
  }

  try {
    // Update or create the push token for the driver
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



export const addfamilyEvent = async (req: Request, res: Response) => {
  const { 
    from, 
    fromCoords, 
    destination, 
    destinationCoords, 
    eventDate, 
    eventTime, 
    bid, 
    noOfDays,
    description
  } = req.body;

  try {
    if (!from || !destination || !eventDate || !eventTime || !fromCoords || !destinationCoords || !bid || !noOfDays) {
      return res.status(400).send('Missing required fields');
    }

    const event = await prisma.event.create({
      data: { 
        from, 
        fromLat: fromCoords.lat, 
        fromLng: fromCoords.lng, 
        destination, 
        destinationLat: destinationCoords.lat, 
        destinationLng: destinationCoords.lng, 
        eventDate: new Date(eventDate), 
        eventTime,
        bid: parseFloat(bid), // Ensure bid is a number
        noOfDays: parseInt(noOfDays, 10), // Ensure noOfDays is a number
        description
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving event');
  }
};


export const getUpcomingEvents = async (req: Request, res: Response) => {
  const now = new Date();
  try {
    // Query upcoming events based on the current date and time
    const events = await prisma.event.findMany({
      where: {
        eventDate: {
          gte: now, // Greater than or equal to the current date and time
        },
      },
    });
    res.status(200).json(events); // Return the list of upcoming events
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events'); // Handle error
  }
};



export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedEvent = await prisma.event.delete({
      where: {
        id: parseInt(id), // Convert the string id to integer
      },
    });
    res.status(200).json(deletedEvent); // Return the deleted event data
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting event');
  }
};


// Add the route to edit an event


export const editEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    from,
    fromLat,
    fromLng,
    destination,
    destinationLat,
    destinationLng,
    eventDate,
    eventTime,
    bid,
    noOfDays
  } = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: {
        from,
        fromLat,
        fromLng,
        destination,
        destinationLat,
        destinationLng,
        eventDate: new Date(eventDate),
        eventTime,
        bid,
        noOfDays
      },
    });
    res.status(200).json(updatedEvent); // Return the updated event data
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating event');
  }
};


export const getSharedRides = async (req: Request, res: Response) => {
  try {
    const rides = await prisma.sharedRide.findMany();
    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching shared rides:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



